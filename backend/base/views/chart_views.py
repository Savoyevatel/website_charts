from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from django.db.models.functions import TruncWeek, TruncMonth, TruncYear
from django.utils import timezone
from base.models import Product, OrderItem


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