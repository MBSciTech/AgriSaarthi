from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import api_view
from rest_framework import generics, permissions
from .models import Blog
from .serializers import BlogSerializer
import requests
from rest_framework import parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Blog, Comment, Poll, Vote
from .serializers import BlogSerializer, CommentSerializer, PollSerializer, VoteSerializer
from rest_framework.decorators import api_view, permission_classes
from .utils.pdf_generator import generate_blog_pdf
from django.db.models import Count
from django.contrib.auth.decorators import user_passes_test
from django.http import HttpResponse
from django.utils import timezone


from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    GovernmentSchemeSerializer
)
from .models import User, GovernmentScheme

#Weather API Key
OPENWEATHER_API_KEY = "2a496ed70c4234605ff47cea15a3bd6a"

# Admin permission check
def is_admin(user):
    print(f"DEBUG: Checking admin access for user {user.name} with role {user.role}")
    print(f"DEBUG: User is_authenticated: {user.is_authenticated}")
    print(f"DEBUG: User is_staff: {user.is_staff}")
    return user.is_authenticated and user.role == 'administrator'

#User Registration
class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 🔐 User Login
class UserLoginView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        password = request.data.get('password')
        user = authenticate(request, phone=phone, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# 👤 User Profile View/Update
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        try:
            print(f"DEBUG: UserProfileView GET called by user {request.user.name}")
            print(f"DEBUG: User ID: {request.user.id}")
            print(f"DEBUG: User Role: {request.user.role}")
            
            # Check if user has required fields
            if not hasattr(request.user, 'name'):
                print("DEBUG: User object missing 'name' field")
                return Response({'error': 'User object is missing required fields'}, status=500)
            
            serializer = UserProfileSerializer(request.user)
            print(f"DEBUG: Serializer created successfully")
            data = serializer.data
            print(f"DEBUG: Serialized data keys: {list(data.keys())}")
            return Response(data)
        except Exception as e:
            print(f"DEBUG: Error in UserProfileView GET: {str(e)}")
            import traceback
            print(f"DEBUG: Full traceback: {traceback.format_exc()}")
            return Response({'error': f'Failed to serialize user profile: {str(e)}'}, status=500)

    def put(self, request):
        try:
            print(f"DEBUG: UserProfileView PUT called by user {request.user.name}")
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
            else:
                print(f"DEBUG: Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"DEBUG: Error in UserProfileView PUT: {str(e)}")
            return Response({'error': f'Failed to update user profile: {str(e)}'}, status=500)

# 🌦️ Current Weather API
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

# 📅 5-day Weather Forecast
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
                return Response({'error': data.get('message', 'Failed to fetch weather forecast')}, status=resp.status_code)
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

# 🏪 Market Price API
class MarketPriceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Mock market price data - replace with actual API
        market_prices = {
            "wheat": {"price": 2200, "unit": "per quintal", "trend": "up"},
            "rice": {"price": 1800, "unit": "per quintal", "trend": "stable"},
            "corn": {"price": 1500, "unit": "per quintal", "trend": "down"},
            "sugarcane": {"price": 320, "unit": "per quintal", "trend": "up"},
            "cotton": {"price": 6500, "unit": "per quintal", "trend": "stable"},
            "soybean": {"price": 4200, "unit": "per quintal", "trend": "up"},
        }
        return Response(market_prices)

# 🏛️ Government Schemes
class GovernmentSchemeListAPIView(generics.ListAPIView):
    queryset = GovernmentScheme.objects.all()
    serializer_class = GovernmentSchemeSerializer

# 🏛️ Government Scheme Detail
@api_view(['GET', 'PUT', 'PATCH'])
def scheme_detail(request, pk):
    try:
        scheme = GovernmentScheme.objects.get(pk=pk)
    except GovernmentScheme.DoesNotExist:
        return Response({'error': 'Scheme not found'}, status=404)

    if request.method == 'GET':
        serializer = GovernmentSchemeSerializer(scheme)
        return Response(serializer.data)
    elif request.method in ['PUT', 'PATCH']:
        serializer = GovernmentSchemeSerializer(scheme, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

# 📝 Blog Create
class BlogCreateView(generics.CreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_serializer_context(self):
        return {'request': self.request}

# 📝 Blog List/Create
class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# 📝 Blog Detail
class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# 💬 Comment List/Create
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        blog_id = self.kwargs.get('blog_id')
        return Comment.objects.filter(blog_id=blog_id).order_by('-created_at')

    def perform_create(self, serializer):
        blog_id = self.kwargs.get('blog_id')
        serializer.save(author=self.request.user, blog_id=blog_id)

# 🗳️ Vote Create
class VoteCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = VoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(voted_by=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

# 👍 Like Blog
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_blog(request, blog_id):
    try:
        blog = Blog.objects.get(id=blog_id)
        user = request.user
        
        if user in blog.likes.all():
            blog.likes.remove(user)
            return Response({'message': 'Blog unliked'}, status=200)
        else:
            blog.likes.add(user)
            return Response({'message': 'Blog liked'}, status=200)
    except Blog.DoesNotExist:
        return Response({'error': 'Blog not found'}, status=404)

# 💾 Toggle Save Post
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_save_post(request, blog_id):
    try:
        blog = Blog.objects.get(id=blog_id)
        user = request.user
        
        if blog in user.saved_posts.all():
            user.saved_posts.remove(blog)
            return Response({'message': 'Post removed from saved'}, status=200)
        else:
            user.saved_posts.add(blog)
            return Response({'message': 'Post saved'}, status=200)
    except Blog.DoesNotExist:
        return Response({'error': 'Blog not found'}, status=404)

# 📚 Get Saved Posts
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_posts(request):
    user = request.user
    saved_posts = user.saved_posts.all().order_by('-created_at')
    serializer = BlogSerializer(saved_posts, many=True, context={'request': request})
    return Response(serializer.data)

# 📄 Download Blog PDF
@api_view(['GET'])
def download_blog_pdf(request, blog_id):
    try:
        blog = Blog.objects.get(id=blog_id)
        pdf_content = generate_blog_pdf(blog)
        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="blog_{blog_id}.pdf"'
        return response
    except Blog.DoesNotExist:
        return Response({'error': 'Blog not found'}, status=404)

# ===== ADMIN API ENDPOINTS =====

# 🧪 Test endpoint
@api_view(['GET'])
def test_admin_endpoint(request):
    return Response({'message': 'Admin endpoint is working!'})

# 🏥 Health check endpoint
@api_view(['GET'])
def health_check(request):
    return Response({
        'status': 'healthy',
        'message': 'Django server is running',
        'timestamp': timezone.now().isoformat()
    })

# 🧪 Test User model endpoint
@api_view(['GET'])
def test_user_model(request):
    try:
        # Test if we can access User model
        user_count = User.objects.count()
        return Response({
            'message': 'User model is working',
            'user_count': user_count,
            'model_fields': [f.name for f in User._meta.get_fields()]
        })
    except Exception as e:
        return Response({
            'error': f'User model test failed: {str(e)}'
        }, status=500)

# 🔍 Debug endpoint to check user status
@api_view(['GET'])
def debug_user_status(request):
    user = request.user
    return Response({
        'user_id': user.id,
        'user_name': user.name,
        'user_role': user.role,
        'is_authenticated': user.is_authenticated,
        'is_staff': user.is_staff,
        'is_admin': is_admin(user),
        'headers': dict(request.headers)
    })

# 📊 Admin Statistics
class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        print(f"DEBUG: AdminStatsView called by user {request.user.name}")
        print(f"DEBUG: Request headers: {request.headers}")
        print(f"DEBUG: User authenticated: {request.user.is_authenticated}")
        
        if not is_admin(request.user):
            print(f"DEBUG: User {request.user.name} is not admin")
            return Response({'error': 'Admin access required'}, status=403)
        
        print(f"DEBUG: User {request.user.name} is admin, getting stats")
        try:
            # Get statistics
            total_users = User.objects.count()
            total_blogs = Blog.objects.count()
            total_schemes = GovernmentScheme.objects.count()
            
            # Users by role
            users_by_role = User.objects.values('role').annotate(count=Count('id'))
            role_stats = {item['role']: item['count'] for item in users_by_role}
            
            print(f"DEBUG: Stats - Users: {total_users}, Blogs: {total_blogs}, Schemes: {total_schemes}")
            return Response({
                'totalUsers': total_users,
                'totalBlogs': total_blogs,
                'totalSchemes': total_schemes,
                'usersByRole': role_stats
            })
        except Exception as e:
            print(f"DEBUG: Error in AdminStatsView: {str(e)}")
            return Response({'error': f'Failed to get statistics: {str(e)}'}, status=500)

# 👥 Admin User Management
class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        users = User.objects.all().order_by('-date_joined')
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data)

class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            user = User.objects.get(id=user_id)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
    
    def patch(self, request, user_id):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            user = User.objects.get(id=user_id)
            serializer = UserProfileSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
    
    def delete(self, request, user_id):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=200)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

# 📝 Admin Blog Management
class AdminBlogListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        blogs = Blog.objects.all().order_by('-created_at')
        serializer = BlogSerializer(blogs, many=True, context={'request': request})
        return Response(serializer.data)

class AdminBlogDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, blog_id):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            blog = Blog.objects.get(id=blog_id)
            serializer = BlogSerializer(blog, context={'request': request})
            return Response(serializer.data)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=404)
    
    def patch(self, request, blog_id):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            blog = Blog.objects.get(id=blog_id)
            serializer = BlogSerializer(blog, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=404)
    
    def delete(self, request, blog_id):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            blog = Blog.objects.get(id=blog_id)
            blog.delete()
            return Response({'message': 'Blog deleted successfully'}, status=200)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=404)

# 🏛️ Admin Scheme Management
class AdminSchemeListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        schemes = GovernmentScheme.objects.all().order_by('-id')
        serializer = GovernmentSchemeSerializer(schemes, many=True)
        return Response(serializer.data)

class AdminSchemeDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, scheme_id):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            scheme = GovernmentScheme.objects.get(id=scheme_id)
            serializer = GovernmentSchemeSerializer(scheme)
            return Response(serializer.data)
        except GovernmentScheme.DoesNotExist:
            return Response({'error': 'Scheme not found'}, status=404)
    
    def patch(self, request, scheme_id):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            scheme = GovernmentScheme.objects.get(id=scheme_id)
            serializer = GovernmentSchemeSerializer(scheme, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except GovernmentScheme.DoesNotExist:
            return Response({'error': 'Scheme not found'}, status=404)
    
    def delete(self, request, scheme_id):
        if not is_admin(request.user):
            return Response({'error': 'Admin access required'}, status=403)
        
        try:
            scheme = GovernmentScheme.objects.get(id=scheme_id)
            scheme.delete()
            return Response({'message': 'Scheme deleted successfully'}, status=200)
        except GovernmentScheme.DoesNotExist:
            return Response({'error': 'Scheme not found'}, status=404)