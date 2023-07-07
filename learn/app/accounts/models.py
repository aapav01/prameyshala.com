from django.db import models
from app.courses.models import Course


class Enrollment(models.Model):
    bought_price = models.FloatField()
    payment_method = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=7)
    user_id = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'enrollments'

class Payments(models.Model):
    payment_gateway_id = models.CharField(max_length=255)
    gateway = models.CharField(max_length=255)
    method = models.CharField(max_length=255)
    currency = models.CharField(max_length=255)
    user_email = models.CharField(max_length=255, blank=True, null=True)
    amount = models.CharField(max_length=255)
    json_response = models.TextField()
    enrollment_id = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'payments'
