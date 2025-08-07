from django.contrib import admin
from .models import (
    User,
    GovernmentScheme,
    Blog,
    Comment,
    Poll,
    Choice,
    Vote
)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('phone', 'name', 'role', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('phone', 'name', 'role')
    list_filter = ('role', 'is_staff', 'is_active')


@admin.register(GovernmentScheme)
class GovernmentSchemeAdmin(admin.ModelAdmin):
    list_display = ('name', 'benefit', 'eligibility', 'apply_url')
    search_fields = ('name', 'benefit', 'eligibility')


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('author', 'created_at', 'visibility')
    search_fields = ('author__name', 'content')
    list_filter = ('visibility', 'created_at')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'blog', 'created_at')
    search_fields = ('author__name', 'blog__content', 'content')


@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ('question', 'created_by', 'created_at')
    search_fields = ('question', 'created_by__name')


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('poll', 'choice_text')


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('poll', 'choice', 'voted_by')
    search_fields = ('voted_by__name', 'poll__question')
