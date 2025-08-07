from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth import get_user_model
from django.conf import settings


ROLE_CHOICES = [
    ('farmer', 'Farmer'),
    ('administrator', 'Administrator'),
    ('government_official', 'Government Official'),
    ('expert_advisor', 'Expert Advisor'),
    ('retailer', 'Retailer'),
]

ACCESS_LEVEL_CHOICES = [
    ('full', 'Full'),
    ('partial', 'Partial'),
    ('content_only', 'Content Only'),
]

TYPE_OF_BUSINESS_CHOICES = [
    ('wholesaler', 'Wholesaler'),
    ('local_buyer', 'Local Buyer'),
    ('agri_retailer', 'Agri Retailer'),
]

class UserManager(BaseUserManager):
    def create_user(self, phone, name, password=None, **extra_fields):
        if not phone:
            raise ValueError('The Phone number must be set')
        user = self.model(phone=phone, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone, name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    # Common fields
    phone = models.CharField(max_length=15, unique=True, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    # Farmer fields
    state = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    village = models.CharField(max_length=100, blank=True)
    preferred_language = models.CharField(max_length=50, blank=True)
    type_of_farming = models.CharField(max_length=50, blank=True)
    main_crops = models.CharField(max_length=255, blank=True)
    farm_size = models.CharField(max_length=50, blank=True)
    voice_input_access = models.BooleanField(null=True, blank=True)
    receive_govt_alerts = models.BooleanField(null=True, blank=True)

    # Expert Advisor fields
    expertise_area = models.CharField(max_length=100, blank=True)
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    state_of_operation = models.CharField(max_length=100, blank=True)
    languages_spoken = models.CharField(max_length=100, blank=True)
    available_for_consult = models.BooleanField(null=True, blank=True)
    certificates = models.FileField(upload_to='certificates/', blank=True, null=True)

    # Administrator fields
    designation = models.CharField(max_length=100, blank=True)
    region_of_responsibility = models.CharField(max_length=100, blank=True)
    access_level = models.CharField(max_length=20, choices=ACCESS_LEVEL_CHOICES, blank=True)
    employee_id = models.CharField(max_length=50, blank=True)
    admin_password = models.CharField(max_length=128, blank=True)  # For dashboard login

    # Government Official fields
    department_name = models.CharField(max_length=100, blank=True)
    official_email = models.EmailField(blank=True, null=True)
    gov_designation = models.CharField(max_length=100, blank=True)
    schemes_managed = models.CharField(max_length=255, blank=True)
    gov_id_badge = models.FileField(upload_to='gov_ids/', blank=True, null=True)
    portal_access_required = models.BooleanField(null=True, blank=True)

    # Retailer/Buyer fields
    business_name = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    type_of_business = models.CharField(max_length=20, choices=TYPE_OF_BUSINESS_CHOICES, blank=True)
    interested_crops = models.CharField(max_length=255, blank=True)
    license_gst_number = models.CharField(max_length=50, blank=True)
    buyer_dashboard_access = models.BooleanField(null=True, blank=True)

    saved_posts = models.ManyToManyField('Blog', blank=True, related_name='saved_by_users')


    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.name} ({self.role})"

class GovernmentScheme(models.Model):
    name = models.CharField(max_length=255)
    benefit = models.TextField()
    eligibility = models.TextField()
    docs = models.TextField(help_text="Required documents (comma-separated or description)")
    apply_url = models.URLField()

    def __str__(self):
        return self.name




# User = get_user_model()
class Blog(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=2000)
    image = models.ImageField(upload_to='blogs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_blogs', blank=True)
    poll = models.OneToOneField('Poll', on_delete=models.SET_NULL, null=True, blank=True, related_name='blog')
    visibility = models.CharField(max_length=10, choices=[('public', 'Public'), ('followers', 'Followers Only')], default='public')
    tags = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Post by {self.author.name} on {self.created_at.date()}"

    def likes_count(self):
        return self.likes.count()




class Poll(models.Model):
    question = models.CharField(max_length=255)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question


class Choice(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name='choices')
    choice_text = models.CharField(max_length=200)

    def __str__(self):
        return self.choice_text


class Vote(models.Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    voted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('poll', 'voted_by')

class Comment(models.Model):
    blog = models.ForeignKey('Blog', on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author.name} on Blog #{self.blog.id}"
