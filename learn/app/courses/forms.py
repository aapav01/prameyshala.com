from django import forms
from django.forms import ModelForm, inlineformset_factory
from .models import Classes, Subject, Chapter, Lesson, Notes, Category, Quiz, Choice, Question, Assignment, AssignmentSubmission
from app.accounts.models import User


class AssignmentForm(ModelForm):
    teacher = forms.ModelChoiceField(
        queryset=User.objects.filter(groups__name='Teacher'))

    class Meta:
        model = Assignment
        fields = "__all__"
        exclude = ['created_by', 'updated_by']
        widgets = {
            'due_date': forms.DateTimeInput(attrs={'type': 'datetime-local'})
        }


class AssignmentSubmissionForm(ModelForm):
    class Meta:
        model = AssignmentSubmission
        fields = ['assignment', 'solution_file']


class AssignmentReviewForm(ModelForm):
    class Meta:
        model = AssignmentSubmission
        fields = ['marks', 'remarks']
        widgets = {
            'marks': forms.NumberInput(attrs={'required': True}),
            'remarks': forms.Textarea(attrs={'required': True}),
        }


class ClassesForm(ModelForm):
    class Meta:
        model = Classes
        fields = "__all__"
        exclude = ['slug']
        widgets = {
            'description': forms.Textarea(attrs={'class': 'editor'}),
        }


class ClassSubjectForm(ModelForm):
    class Meta:
        model = Subject
        exclude = ['slug', 'standard']
        widgets = {
            'publish_at': forms.DateTimeInput(attrs={'type': 'datetime-local'})
        }


class SubjectForm(ModelForm):
    class Meta:
        model = Subject
        fields = "__all__"
        exclude = ['slug']
        widgets = {
            'publish_at': forms.DateTimeInput(attrs={'type': 'datetime-local'})
        }


class SubjectChatperForm(ModelForm):
    class Meta:
        model = Chapter
        exclude = ['collectionid', 'user', 'subject']


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


class QuizForm(ModelForm):
    class Meta:
        model = Quiz
        fields = "__all__"


class QuestionForm(ModelForm):
    class Meta:
        model = Question
        exclude = ['quiz']
        widgets = {
            'question_text': forms.Textarea(attrs={'required': True}),
        }


class NotesForm(ModelForm):
    class Meta:
        model = Notes
        fields = "__all__"


QuestionInlineFormSet = inlineformset_factory(
    Quiz, Question, extra=1, fields="__all__")

# will using this for create but not for update because of the extra=2 and we are using this for create quiz at first place
# but while updating we are dividing form for question and quiz separately adding child question to parent quiz
ChoiceInlineFormSet = inlineformset_factory(
    Question, Choice, extra=4, fields="__all__")

# will using this for update in update_form.html because we want to update each question and choice separately
ChoiceInlineUpdateFormSet = inlineformset_factory(
    Question, Choice, extra=0, fields="__all__")
