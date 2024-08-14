from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import get_object_or_404
from base.models import Product, Review, OrderItem
from base.serializers import ProductSerializer, UserSerializerWithToken
from django.db.models import Sum
from django.utils import timezone
from django.db.models.functions import TruncWeek, TruncMonth, TruncYear


from rest_framework import status


@api_view(["GET"])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''

    products = Product.objects.filter(name__icontains=query)
    
    page = request.query_params.get('page')
    paginator = Paginator(products, 15)
    #number of products per page

    try:
        products = paginator.page(page)

    except PageNotAnInteger:
        products = paginator.page(1)
    #when not send anything

    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1
    
    page = int(page)    

    serializer = ProductSerializer(products, many = True)
    return Response({'products':serializer.data, 'page':page, 'pages':paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getProduct(request, pk):
    product = get_object_or_404(Product, _id=pk)
    serializer = ProductSerializer(product, many=False)

    # Calculate total items purchased
    total_items_purchased = OrderItem.objects.filter(product=product).aggregate(Sum('qty'))['qty__sum'] or 0

    # Get the current date
    current_date = timezone.now()

    # Calculate sales data for the last 12 weeks
    weekly_sales = OrderItem.objects.filter(
        product=product,
        order__isPaid=True,
        order__paidAt__gte=current_date - timezone.timedelta(weeks=12)
    ).annotate(
        week=TruncWeek('order__paidAt')
    ).values('week').annotate(
        total_sales=Sum('qty')
    ).order_by('week')

    # Calculate sales data for the last 12 months
    monthly_sales = OrderItem.objects.filter(
        product=product,
        order__isPaid=True,
        order__paidAt__gte=current_date - timezone.timedelta(days=365)
    ).annotate(
        month=TruncMonth('order__paidAt')
    ).values('month').annotate(
        total_sales=Sum('qty')
    ).order_by('month')

    # Calculate sales data for the last 5 years
    yearly_sales = OrderItem.objects.filter(
        product=product,
        order__isPaid=True,
        order__paidAt__gte=current_date - timezone.timedelta(days=365*5)
    ).annotate(
        year=TruncYear('order__paidAt')
    ).values('year').annotate(
        total_sales=Sum('qty')
    ).order_by('year')

    product_data = serializer.data
    product_data['total_items_purchased'] = total_items_purchased
    product_data['weekly_sales'] = list(weekly_sales)
    product_data['monthly_sales'] = list(monthly_sales)
    product_data['yearly_sales'] = list(yearly_sales)

    return Response(product_data)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user = user,
        name = 'Sample name',
        price = 0,
        brand = 'Sample Brand',
        countInStock = 0,
        category = 'Sample Category',
        description = ''
    )

    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def getProductSales(request, pk):
    product = Product.objects.get(_id=pk)
    sales_data = {
        'price': product.price,
        'category': product.category,
        'countInStock': product.countInStock,
    }
    return Response(sales_data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response("Product Deleted")

@api_view(['POST'])
def uploadImage(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)
    
    product.image = request.FILES.get('image')
    product.save()
    return Response("Image was uploaded")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail':'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    #2 No Rating or 0
    elif data['rating'] == 0:
        content = {'detail':'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],

        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')
    
