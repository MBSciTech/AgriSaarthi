from django.urls import path
from .views import UserRegisterView, UserLoginView, UserProfileView, WeatherAPIView, WeatherForecastAPIView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('weather/', WeatherAPIView.as_view(), name='weather'),
    path('weather-forecast/', WeatherForecastAPIView.as_view(), name='weather-forecast'),
] 