from django.urls import path
from base.views import ml_views as views

urlpatterns = [
    # ... other url patterns
    path('analyze-sentiment/<int:product_id>/', views.analyzeSentiment, name='analyze-sentiment'),
 
]