from django.db import models
from app.accounts.models import User
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator


class Classes(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(
        upload_to='static/uploads/classes', blank=True, null=True)
    slug = models.SlugField(unique=True, max_length=255)
    latest_price = models.FloatField(
        default=0.0, validators=[MinValueValidator(0.0)])
    before_price = models.FloatField(
        default=0.0, validators=[MinValueValidator(0.0)])
    postition = models.IntegerField(blank=True, null=True)
    publish_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'classes'


class Category(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False)
    description = models.TextField(max_length=255, blank=True, null=True)
    popular = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'categories'


class Subject(models.Model):
    name = models.CharField(max_length=255)
    short = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE)
    slug = models.SlugField(unique=True, max_length=255)
    image = models.ImageField(
        upload_to='static/uploads/subjects', blank=True, null=True)
    publish_at = models.DateTimeField(blank=True, null=True)
    standard = models.ForeignKey(Classes, on_delete=models.CASCADE)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name + ' - ' + self.standard.name

    class Meta:
        db_table = 'subjects'


class Chapter(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(
        upload_to='static/uploads/chapters', blank=True, null=True)
    collectionid = models.CharField(
        db_column='collectionId', max_length=255, blank=True, null=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name + ' - ' + self.subject.name + ' - ' + self.subject.standard.name

    class Meta:
        db_table = 'chapters'


class Quiz(models.Model):
    class Type(models.TextChoices):
        Mock = 'mock', _('Mock')
        Practice = 'practice', _('Practice')

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=Type.choices)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    publish_at = models.DateTimeField(auto_now_add=True)
    time_required = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'quizzes'


class Question(models.Model):
    question_text = models.TextField()
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    figure = models.ImageField(
        upload_to='uploads/', blank=True, null=True, verbose_name=_("Figure"))

    def __str__(self):
        return self.question_text

    class Meta:
        db_table = 'questions'


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.choice_text

    class Meta:
        db_table = 'choices'


class Assignment(models.Model):
    class Type(models.TextChoices):
        Mock = 'mock', _('Mock')
        Practice = 'practice', _('Practice')
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateTimeField(blank=True, null=True)
    teacher = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True)
    assigment_file = models.FileField(upload_to='static/uploads/assignments', blank=True, null=True)
    type = models.CharField(max_length=20, choices=Type.choices)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='assignment_created_by')
    updated_by = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name='assignment_updated_by')
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    solution_file = models.FileField(
        upload_to='static/uploads/assignments/submissions')
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"{self.assignment.title} - {self.student.full_name}"


class Grades(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    enrolled_class = models.ForeignKey(Classes, on_delete=models.CASCADE)
    assignment = models.ForeignKey(
        Assignment, null=True, blank=True, on_delete=models.CASCADE)
    quiz = models.ForeignKey(
        Quiz, null=True, blank=True, on_delete=models.CASCADE)
    grade = models.DecimalField(max_digits=2,
                                decimal_places=1,
                                validators=[MinValueValidator(0.0), MaxValueValidator(10.0)])

    def __str__(self):
        if self.assignment:
            return f"{self.student.full_name} - Class {self.enrolled_class} - Assignment: {self.assignment.title} - Score: {self.grade}"
        elif self.quiz:
            return f"{self.student.full_name} - Class {self.enrolled_class} - Quiz: {self.quiz.name} - Score: {self.grade}"
        return f"{self.student.full_name} - Class {self.enrolled_class} - Score: {self.grade}"


class Lesson(models.Model):
    class UploadStatus(models.TextChoices):
        CREATED = 'created', _('Created')
        PENDING = 'pending', _('Pending')
        UPLOADING = 'uploading', _('Uploading')
        PROCESSING = 'processing', _('Processing')
        READY = 'ready', _('Ready')
        ERROR = 'error', _('Error')

    class LessonType(models.TextChoices):
        NONE = None, _('---------')
        VIDEO = 'video', _('Video')
        DOCUMENT = 'document', _('Document')
        AUDIO = 'audio', _('Audio')
        IMAGE = 'image', _('Image')
        TEXT = 'text', _('Text')
        QUIZ = 'quiz', _('Quiz')

    class SupportPlatform(models.TextChoices):
        FILE = 'file', _('File')
        YOUTUBE = 'youtube', _('Youtube')
        VIMEO = 'vimeo', _('Vimeo')

    title = models.CharField(max_length=255)
    description = models.TextField(max_length=255, blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    thumb_url = models.ImageField(
        upload_to='static/uploads/lessons', blank=True, null=True)
    public = models.BooleanField(default=False)
    position = models.IntegerField(blank=True, null=True, default=9999)
    lesson_type = models.CharField(
        db_column='type', max_length=8, choices=LessonType.choices, default=None)
    status = models.CharField(
        max_length=10, choices=UploadStatus.choices, default=UploadStatus.CREATED)
    platform = models.CharField(
        max_length=11, blank=True, null=True, choices=SupportPlatform.choices, default=None)
    platform_video_id = models.CharField(max_length=255, blank=True, null=True)
    teacher = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, blank=True, null=True, related_name='teacher')
    created_by = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, related_name='created_by')
    updated_by = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, blank=True, null=True, related_name='updated_by')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    quiz = models.ForeignKey(
        Quiz, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'lessons'
