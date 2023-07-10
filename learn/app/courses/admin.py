from django.contrib import admin
from .models import Classes, Subject, Chapter, Lesson

class ClassesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at', 'updated_at')
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    prepopulated_fields = {"slug": ("name",)}
    list_per_page = 25

class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at', 'updated_at')
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    prepopulated_fields = {"slug": ("name",)}
    list_per_page = 25

class ChapterAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'user', 'created_at', 'updated_at')
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    list_per_page = 25

class LessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'public')
    list_display_links = ('id', 'title')
    search_fields = ('title',)
    list_per_page = 25

admin.site.register(Classes, ClassesAdmin)
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Chapter, ChapterAdmin)
admin.site.register(Lesson, LessonAdmin)
