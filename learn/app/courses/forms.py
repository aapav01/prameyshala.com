from django.forms import ModelForm
from .models import Classes, Subject, Chapter, Lesson


class ClassesForm(ModelForm):
    class Meta:
        model = Classes
        fields = "__all__"


class SubjectForm(ModelForm):
    class Meta:
        model = Subject
        fields = "__all__"


class ChapterForm(ModelForm):
    class Meta:
        model = Chapter
        fields = "__all__"


class LessonForm(ModelForm):
    class Meta:
        model = Lesson
        fields = "__all__"
