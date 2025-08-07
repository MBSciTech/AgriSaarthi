from rest_framework import serializers
from .models import User, GovernmentScheme
from .models import Blog, Comment, Poll, Choice, Vote

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['phone', 'name', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    # Start with only the most essential fields to avoid serialization issues
    class Meta:
        model = User
        fields = [
            'id', 'phone', 'email', 'name', 'role', 'is_active', 'is_staff', 
            'date_joined', 'profile_image'
        ]
        read_only_fields = ['id', 'date_joined']
    
    def to_representation(self, instance):
        """Custom representation to handle potential serialization issues"""
        try:
            data = super().to_representation(instance)
            # Remove any None values that might cause issues
            for key in list(data.keys()):
                if data[key] is None:
                    data[key] = ""
            return data
        except Exception as e:
            print(f"DEBUG: Serialization error in UserProfileSerializer: {str(e)}")
            # Return basic user info if serialization fails
            return {
                'id': instance.id,
                'name': instance.name,
                'phone': instance.phone or "",
                'email': instance.email or "",
                'role': instance.role or "",
                'is_active': instance.is_active,
                'is_staff': instance.is_staff,
                'date_joined': instance.date_joined.isoformat() if instance.date_joined else "",
                'error': f'Serialization error: {str(e)}'
            }

class GovernmentSchemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GovernmentScheme
        fields = '__all__' 





# --- Poll System ---
class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'choice_text']

class PollSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)

    class Meta:
        model = Poll
        fields = ['id', 'question', 'choices', 'created_by', 'created_at']

    def create(self, validated_data):
        choices_data = validated_data.pop('choices')
        poll = Poll.objects.create(**validated_data)
        for choice_data in choices_data:
            Choice.objects.create(poll=poll, **choice_data)
        return poll

# --- Blog ---
class BlogSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    poll = PollSerializer(required=False, allow_null=True)
    is_saved = serializers.SerializerMethodField()

    def get_is_saved(self, obj):
        user = self.context['request'].user
        return user.is_authenticated and obj in user.saved_posts.all()

    class Meta:
        model = Blog
        fields = [
            'id', 'author', 'author_name', 'content', 'image', 'created_at',
            'updated_at', 'likes_count', 'poll', 'visibility', 'tags','is_saved'
        ]
        read_only_fields = ['author', 'author_name', 'likes_count', 'created_at', 'updated_at','is_saved']

    def create(self, validated_data):
        poll_data = validated_data.pop('poll', None)
        user = self.context['request'].user

        blog = Blog.objects.create(author=user, **validated_data)

        if poll_data:
            poll = Poll.objects.create(
                question=poll_data['question'],
                created_by=user
            )
            for choice in poll_data['choices']:
                Choice.objects.create(poll=poll, **choice)
            blog.poll = poll
            blog.save()

        return blog

    


# --- Comment ---
class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'blog', 'author', 'author_name', 'content', 'created_at']
        read_only_fields = ['id', 'blog', 'author', 'author_name', 'created_at']


# --- Vote ---
class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['poll', 'choice', 'voted_by']
