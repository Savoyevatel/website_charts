from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models.functions import TruncWeek, TruncMonth, TruncYear
from django.utils import timezone
from base.models import Product, OrderItem
from base.models import Profile
from django.db.models import Count
from django.shortcuts import get_object_or_404, render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.db.models import Sum, F
from base.models import OrderItem,User, Order
import csv
from django.http import HttpResponse


@api_view(['GET'])
def product_sales_chart(request):
    products = Product.objects.all()
    current_date = timezone.now()
    data = []

    for product in products:
        # Calculate total items purchased
        total_items_purchased = OrderItem.objects.filter(product=product).aggregate(Sum('qty'))['qty__sum'] or 0

        # Calculate sales per week (last 12 weeks)
        sales_per_week = OrderItem.objects.filter(
            product=product,
            order__isPaid=True,
            order__paidAt__gte=current_date - timezone.timedelta(weeks=12)
        ).annotate(
            week=TruncWeek('order__paidAt')
        ).values('week').annotate(
            Units=Sum('qty')
        ).order_by('week')

        # Calculate sales per month (last 12 months)
        sales_per_month = OrderItem.objects.filter(
            product=product,
            order__isPaid=True,
            order__paidAt__gte=current_date - timezone.timedelta(days=365)
        ).annotate(
            month=TruncMonth('order__paidAt')
        ).values('month').annotate(
            Units=Sum('qty')
        ).order_by('month')

        # Calculate sales per year (last 5 years)
        sales_per_year = OrderItem.objects.filter(
            product=product,
            order__isPaid=True,
            order__paidAt__gte=current_date - timezone.timedelta(days=365*5)
        ).annotate(
            year=TruncYear('order__paidAt')
        ).values('year').annotate(
            Units=Sum('qty')
        ).order_by('year')

        data.append({
            'name': product.name,
            'Units': total_items_purchased,
            'price': float(product.price),
            'sales_per_week': list(sales_per_week),
            'sales_per_month': list(sales_per_month),
            'sales_per_year': list(sales_per_year)
        })

    return Response(data)


# @api_view(['GET'])
# def dashboard_data(request):
#     # Get the current date and time
#     now = timezone.now()
    
#     # Calculate the start of the current year
#     year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

#     # Calculate total units sold this year
#     total_units = OrderItem.objects.filter(created_at__gte=year_start).aggregate(Sum('qty'))['qty__sum'] or 0

#     # Calculate total income this year
#     total_income = OrderItem.objects.filter(created_at__gte=year_start).aggregate(total=Sum('price' * 'qty'))['total'] or 0

#     # Count unique customers this year
#     unique_customers = OrderItem.objects.filter(created_at__gte=year_start).values('order__user').distinct().count()

#     # Count current inventory
#     current_inventory = Product.objects.aggregate(Sum('countInStock'))['countInStock__sum'] or 0

#     data = {
#         'units_sold': total_units,
#         'income': total_income,
#         'customers': unique_customers,
#         'inventory': current_inventory,
#     }

#     return Response(data)



@api_view(['GET'])
def income_sales_chart(request):
    products = Product.objects.all()
    current_date = timezone.now()
    data = []

    for product in products:
        # Calculate total income
        total_income = OrderItem.objects.filter(product=product).aggregate(
            total=Sum(F('qty') * F('price'))
        )['total'] or 0

        # Calculate income per week (last 12 weeks)
        income_per_week = OrderItem.objects.filter(
            product=product,
            order__isPaid=True,
            order__paidAt__gte=current_date - timezone.timedelta(weeks=12)
        ).annotate(
            week=TruncWeek('order__paidAt')
        ).values('week').annotate(
            Income=Sum(F('qty') * F('price'))
        ).order_by('week')

        # Calculate income per month (last 12 months)
        income_per_month = OrderItem.objects.filter(
            product=product,
            order__isPaid=True,
            order__paidAt__gte=current_date - timezone.timedelta(days=365)
        ).annotate(
            month=TruncMonth('order__paidAt')
        ).values('month').annotate(
            Income=Sum(F('qty') * F('price'))
        ).order_by('month')

        # Calculate income per year (last 5 years)
        income_per_year = OrderItem.objects.filter(
            product=product,
            order__isPaid=True,
            order__paidAt__gte=current_date - timezone.timedelta(days=365*5)
        ).annotate(
            year=TruncYear('order__paidAt')
        ).values('year').annotate(
            Income=Sum(F('qty') * F('price'))
        ).order_by('year')

        data.append({
            'name': product.name,
            'TotalIncome': float(total_income),
            'price': float(product.price),
            'income_per_week': list(income_per_week),
            'income_per_month': list(income_per_month),
            'income_per_year': list(income_per_year)
        })

    return Response(data)


# @api_view(['GET'])
# def user_registration_stats(request):
#     data = {
#         'weekly': Profile.objects.annotate(week=TruncWeek('joindate')).values('week').annotate(count=Count('id')).order_by('week'),
#         'monthly': Profile.objects.annotate(month=TruncMonth('joindate')).values('month').annotate(count=Count('id')).order_by('month'),
#         'yearly': Profile.objects.annotate(year=TruncYear('joindate')).values('year').annotate(count=Count('id')).order_by('year'),
#     }
#     return Response(data)

@api_view(['GET'])
def user_registration_stats(request):
    CUSTOMER_ROLE = 1  #1 is the role value for Customer

    data = {
        'weekly': Profile.objects.filter(role=CUSTOMER_ROLE)
                                  .annotate(week=TruncWeek('joindate'))
                                  .values('week')
                                  .annotate(count=Count('id'))
                                  .order_by('week'),
        'monthly': Profile.objects.filter(role=CUSTOMER_ROLE)
                                  .annotate(month=TruncMonth('joindate'))
                                  .values('month')
                                  .annotate(count=Count('id'))
                                  .order_by('month'),
        'yearly': Profile.objects.filter(role=CUSTOMER_ROLE)
                                  .annotate(year=TruncYear('joindate'))
                                  .values('year')
                                  .annotate(count=Count('id'))
                                  .order_by('year'),
    }
    return Response(data)



@api_view(['GET'])
def getTotalIncomeByCategory(request):
    # Aggregate total income by product category
    category_income = OrderItem.objects.values('product__category').annotate(
        total_income=Sum(F('qty') * F('price'))
    ).order_by('-total_income')

    # Format the data as a list of dictionaries
    data = [
        {'category': item['product__category'], 'total_income': item['total_income']}
    for item in category_income]

    return Response(data, status=status.HTTP_200_OK)

@api_view(["GET"])
#@permission_classes([IsAdminUser])
def getTotalSpendingByCustomer(request):
    orders = Order.objects.filter(isPaid=True).values('user__username').annotate(total_spent=Sum('totalPrice'))
    data = [{'customer': order['user__username'], 'total_spent': order['total_spent']} for order in orders]
    return Response(data)

@api_view(['GET'])
def getUserSpendings(request):
    users = User.objects.annotate(total_spent=Sum('order__totalPrice')).order_by('-total_spent')
    user_spendings = [{'customer': user.email, 'total_spent': user.total_spent or 0} for user in users]
    return Response(user_spendings)

    
@api_view(['GET'])
def downloadUserSpendings(request):
    users = User.objects.annotate(total_spent=Sum('order__totalPrice')).order_by('-total_spent')
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="user_spendings.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Customer', 'Total Spent'])  # CSV Header
    
    for user in users:
        writer.writerow([user.email, user.total_spent or 0])
    
    return response