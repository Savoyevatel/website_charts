from django.urls import path
from base.views import chart_views as views

urlpatterns = [
    # ... other url patterns
    path('chart/', views.product_sales_chart, name='product_sales_chart'),
   #path('dashboard/', views.dashboard_data, name='dashboard-data'),
]