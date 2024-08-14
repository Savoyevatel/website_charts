from django.urls import path
from base.views import chart_views as views

urlpatterns = [
    # ... other url patterns
    path('chart/', views.product_sales_chart, name='product_sales_chart'),
    path('income/', views.income_sales_chart, name="income_sales_chart"),
    path('register_stat/', views.user_registration_stats, name='user-registered-stat'),
    path('chart_prod/', views.getTotalIncomeByCategory, name='product-revenue-chart'),
    #path('chart_customer/', views.getTotalSpendingByCustomer, name='customer-revenue-chart'),
    path('user_spend/', views.getUserSpendings, name='user-spendings-chart'),
   #path('dashboard/', views.dashboard_data, name='dashboard-data'),
    path('user_download/', views.downloadUserSpendings, name='user-download'),
]