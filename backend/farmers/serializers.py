from rest_framework import serializers
from .models import Farmer

class FarmerRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Farmer
        fields = ['phone', 'name', 'region', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        farmer = Farmer(**validated_data)
        farmer.set_password(password)
        farmer.save()
        return farmer 