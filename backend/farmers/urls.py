from django.urls import path
from .views import FarmerRegisterView, FarmerLoginView

urlpatterns = [
    path('register/', FarmerRegisterView.as_view(), name='farmer-register'),
    path('login/', FarmerLoginView.as_view(), name='farmer-login'),
] 