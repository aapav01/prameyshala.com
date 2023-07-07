from django.db import models
from app.accounts.models import User

class Classes(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.CharField(max_length=255)
    slug = models.CharField(unique=True, max_length=255)
    postition = models.IntegerField()
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
    slug = models.CharField(unique=True, max_length=255)
    image = models.CharField(max_length=255)
    publish_at = models.DateTimeField()
    standard_id = models.ForeignKey(Classes, on_delete=models.CASCADE)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'subjects'

class Chapter(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255)
    collectionid = models.CharField(
        db_column='collectionId', max_length=255, blank=True, null=True)
    course_id = models.ForeignKey(Subject, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'chapters'

class Lesson(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    thumb_url = models.CharField(max_length=255, blank=True, null=True)
    public = models.IntegerField()
    position = models.IntegerField()
    lesson_type = models.CharField(db_column='type', max_length=8)
    status = models.CharField(max_length=10)
    platform = models.CharField(max_length=11, blank=True, null=True)
    platform_video_id = models.CharField(max_length=255, blank=True, null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    chapter_id = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'lessons'


