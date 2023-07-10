from django.db import models
from app.accounts.models import User

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

class Subject(models.Model):
    name = models.CharField(max_length=255)
    short = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    slug = models.SlugField(unique=True, max_length=255)
    image = models.ImageField(upload_to='static/uploads/subjects', blank=True, null=True)
    publish_at = models.DateTimeField()
    standard = models.ForeignKey(Classes, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'subjects'

class Chapter(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='static/uploads/chapters', blank=True, null=True)
    collectionid = models.CharField(
        db_column='collectionId', max_length=255, blank=True, null=True)
    course = models.ForeignKey(Subject, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'chapters'

class Lesson(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    thumb_url = models.ImageField(upload_to='static/uploads/lessons', blank=True, null=True)
    public = models.IntegerField()
    position = models.IntegerField(blank=True, null=True)
    lesson_type = models.CharField(db_column='type', max_length=8)
    status = models.CharField(max_length=10)
    platform = models.CharField(max_length=11, blank=True, null=True)
    platform_video_id = models.CharField(max_length=255, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'lessons'


