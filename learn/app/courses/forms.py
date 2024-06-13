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
    class_field = forms.ModelChoiceField(queryset=Classes.objects.all(), label="Class")
    subject_field = forms.ChoiceField(label="Subject", choices=[])
    chapter_field = forms.ChoiceField(label="Chapter", choices=[])

    class Meta:
        model = Quiz
        fields = ['name', 'type', 'time_required']

    def __init__(self, *args, **kwargs):
        super(QuizForm, self).__init__(*args, **kwargs)
        if 'instance' in kwargs:
            quiz_instance = kwargs['instance']
            self.fields['class_field'].initial = quiz_instance.chapter.subject.standard.id
            self.fields['subject_field'].choices = [(subject.id, subject.name) for subject in Subject.objects.filter(standard=quiz_instance.chapter.subject.standard)]
            self.fields['subject_field'].initial = quiz_instance.chapter.subject.id
            self.fields['chapter_field'].queryset = Chapter.objects.filter(subject=quiz_instance.chapter.subject)
            self.fields['chapter_field'].initial = quiz_instance.chapter.id
        elif 'class_field' in self.data:
            try:
                class_id = int(self.data.get('class_field'))
                self.fields['subject_field'].choices = [(subject.id, subject.name) for subject in Subject.objects.filter(standard_id=class_id)]
            except (ValueError, TypeError):
                print(ValueError)

        if 'subject_field' in self.data:
            try:
                subject_id = int(self.data.get('subject_field'))
                self.fields['chapter_field'].choices = [(chapter.id, chapter.name) for chapter in Chapter.objects.filter(subject_id=subject_id)]
            except (ValueError, TypeError):
                self.fields['chapter_field'].choices = []
        elif self.instance.pk:
            self.fields['chapter_field'].choices = [(chapter.id, chapter.name) for chapter in Chapter.objects.filter(subject=self.instance.chapter.subject)]

    def clean(self):
        cleaned_data = super().clean()
        if not cleaned_data.get('subject_field'):
            self.add_error('subject_field', 'This field is required.')
        if not cleaned_data.get('chapter_field'):
            self.add_error('chapter_field', 'This field is required.')
        return cleaned_data


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
