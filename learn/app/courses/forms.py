from django import forms
from django.forms import ModelForm, inlineformset_factory
from .models import Classes, Subject, Chapter, Lesson, Category, Quiz, Choice, Question
from app.accounts.models import User


class ClassesForm(ModelForm):
    class Meta:
        model = Classes
        fields = "__all__"
        exclude = ['slug']
        widgets = {
            'description': forms.Textarea(attrs={'class': 'editor'}),
        }


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
    teacher = forms.ModelChoiceField(
        queryset=User.objects.filter(groups__name='Teacher'))

    class Meta:
        model = Lesson
        exclude = ['status', 'length', 'position',
                   'platform_video_id', 'created_by', 'updated_by']
        widgets = {
            'lesson_type': forms.Select(attrs={'required': True}),
        }


class CategoriesForm(ModelForm):
    class Meta:
        model = Category
        fields = "__all__"


QuestionInlineFormSet = inlineformset_factory(Quiz, Question, extra=1, fields = "__all__")
ChoiceInlineFormSet = inlineformset_factory(Question, Choice, extra=1, fields = "__all__")

QuestionInlineUpdateFormSet = inlineformset_factory(Quiz, Question, extra=0, fields = "__all__")
ChoiceInlineUpdateFormSet = inlineformset_factory(Question, Choice, extra=0, fields = "__all__")
