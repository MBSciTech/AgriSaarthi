from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import FarmerRegistrationSerializer
from .models import Farmer

# Create your views here.

class FarmerRegisterView(APIView):
    def post(self, request):
        serializer = FarmerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            farmer = serializer.save()
            token, created = Token.objects.get_or_create(user=farmer)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FarmerLoginView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        password = request.data.get('password')
        farmer = authenticate(request, phone=phone, password=password)
        if farmer is not None:
            token, created = Token.objects.get_or_create(user=farmer)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
