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
    class Meta:
        model = User
        fields = [
            'id', 'phone', 'email', 'name', 'role', 'is_active', 'is_staff',
            'date_joined', 'profile_image',
            # Farmer fields
            'state', 'district', 'village', 'preferred_language', 'type_of_farming', 'main_crops', 'farm_size', 'voice_input_access', 'receive_govt_alerts',
            # Expert Advisor fields
            'expertise_area', 'experience_years', 'state_of_operation', 'languages_spoken', 'available_for_consult', 'certificates',
            # Administrator fields
            'designation', 'region_of_responsibility', 'access_level', 'employee_id',
            # Government Official fields
            'department_name', 'official_email', 'gov_designation', 'schemes_managed', 'gov_id_badge', 'portal_access_required',
            # Retailer fields
            'business_name', 'location', 'type_of_business', 'interested_crops', 'license_gst_number', 'buyer_dashboard_access',
        ]
        read_only_fields = ['id', 'date_joined']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Fill missing fields with empty string for frontend compatibility
        for field in self.Meta.fields:
            if field not in data or data[field] is None:
                data[field] = ""
        return data

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
