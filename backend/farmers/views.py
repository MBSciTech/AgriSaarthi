from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserProfileSerializer
from .models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import requests

OPENWEATHER_API_KEY = "2a496ed70c4234605ff47cea15a3bd6a"

# Create your views here.

class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        password = request.data.get('password')
        user = authenticate(request, phone=phone, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        role = request.data.get('role')
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            if role == "administrator":
                user.is_staff = True
                user.save()
            elif role:
                user.is_staff = False
                user.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WeatherAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        if not lat or not lon:
            return Response({'error': 'lat and lon are required'}, status=400)
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        try:
            resp = requests.get(url, timeout=5)
            data = resp.json()
            if resp.status_code != 200:
                return Response({'error': data.get('message', 'Failed to fetch weather')}, status=resp.status_code)
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class WeatherForecastAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        if not lat or not lon:
            return Response({'error': 'lat and lon are required'}, status=400)
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        try:
            resp = requests.get(url, timeout=5)
            data = resp.json()
            if resp.status_code != 200:
                return Response({'error': data.get('message', 'Failed to fetch forecast')}, status=resp.status_code)
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class MarketPriceAPIView(APIView):
    def get(self, request):
        API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
        RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"
        base_url = f"https://api.data.gov.in/resource/{RESOURCE_ID}?api-key={API_KEY}&format=json&limit=100"
        # Optional filters from query params
        commodity = request.query_params.get('commodity')
        state = request.query_params.get('state')
        market = request.query_params.get('market')
        filters = []
        if commodity:
            filters.append(f"filters[commodity]={commodity}")
        if state:
            filters.append(f"filters[state]={state}")
        if market:
            filters.append(f"filters[market]={market}")
        url = base_url
        if filters:
            url += "&" + "&".join(filters)
        try:
            resp = requests.get(url, timeout=5)
            data = resp.json()
            if resp.status_code != 200:
                return Response({'error': data.get('message', 'Failed to fetch market prices')}, status=resp.status_code)
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
