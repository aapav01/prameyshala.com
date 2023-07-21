from django.db import models
from app.accounts.models import User
from django.utils.translation import gettext_lazy as _

class Classes(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='static/uploads/classes', blank=True, null=True)
    slug = models.SlugField(unique=True, max_length=255)
    postition = models.IntegerField(blank=True, null=True)
    publish_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'classes'

class Category(models.Model):
    name = models.CharField(max_length=50,blank=False, null=False)
    description = models.TextField(max_length=255,blank=True,null=True)

    def __str__(self):
        return self.name

class Subject(models.Model):
    name = models.CharField(max_length=255)
    short = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    category = models.ForeignKey(Category,on_delete=models.CASCADE,blank=False,null=False,default="")
    slug = models.SlugField(unique=True, max_length=255)
    image = models.ImageField(upload_to='static/uploads/subjects', blank=True, null=True)
    publish_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    standard = models.ForeignKey(Classes, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name + ' - ' + self.standard.name

    class Meta:
        db_table = 'subjects'

class Chapter(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='static/uploads/chapters', blank=True, null=True)
    collectionid = models.CharField(
        db_column='collectionId', max_length=255, blank=True, null=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name + ' - ' + self.subject.name

    class Meta:
        db_table = 'chapters'

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

    class SupportPlatform(models.TextChoices):
        FILE = 'file', _('File')
        YOUTUBE = 'youtube', _('Youtube')
        VIMEO = 'vimeo', _('Vimeo')

    title = models.CharField(max_length=255)
    description = models.TextField(max_length=255, blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    thumb_url = models.ImageField(upload_to='static/uploads/lessons', blank=True, null=True)
    public = models.BooleanField(default=False)
    position = models.IntegerField(blank=True, null=True, default=9999)
    lesson_type = models.CharField(db_column='type', max_length=8, choices=LessonType.choices, default=None)
    status = models.CharField(max_length=10, choices=UploadStatus.choices, default=UploadStatus.CREATED)
    platform = models.CharField(max_length=11, blank=True, null=True, choices=SupportPlatform.choices, default=None)
    platform_video_id = models.CharField(max_length=255, blank=True, null=True)
    teacher = models.ForeignKey(User, on_delete=models.DO_NOTHING, blank=True, null=True, related_name='teacher')
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='created_by')
    updated_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, blank=True, null=True, related_name='updated_by')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'lessons'

