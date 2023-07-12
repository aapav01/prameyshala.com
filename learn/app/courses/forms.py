from django import forms
from django.forms import ModelForm
from .models import Classes, Subject, Chapter, Lesson


class ClassesForm(ModelForm):
    class Meta:
        model = Classes
        fields = "__all__"
        exclude = ['slug']


class SubjectForm(ModelForm):
    class Meta:
        model = Subject
        fields = "__all__"
        exclude = ['publish_at', 'slug']


class ChapterForm(ModelForm):
    class Meta:
        model = Chapter
        exclude = ['collectionid', 'user']


class LessonForm(ModelForm):
    template_name = "lessons/form_snippet.html"
    class Meta:
        model = Lesson
        exclude = ['status', 'length', 'position', 'platform_video_id', 'created_by', 'updated_by']
        widgets = {
            'lesson_type': forms.Select(attrs={'required': True}),
        }
