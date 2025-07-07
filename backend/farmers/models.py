from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Create your models here.

class FarmerManager(BaseUserManager):
    def create_user(self, phone, name, region, password=None, **extra_fields):
        if not phone:
            raise ValueError('The Phone number must be set')
        user = self.model(phone=phone, name=name, region=region, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, name, region, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone, name, region, password, **extra_fields)

class Farmer(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = FarmerManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['name', 'region']

    def __str__(self):
        return f"{self.name} ({self.phone})"
