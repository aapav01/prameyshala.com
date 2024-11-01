# Generated by Django 4.2.3 on 2023-08-16 18:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0017_alter_user_phone_number'),
        ('courses', '0027_assignmentsubmission_marks_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='chapter',
            field=models.ForeignKey(
                default=None, on_delete=django.db.models.deletion.CASCADE, to='courses.chapter'),
        ),
        migrations.AddField(
            model_name='grades',
            name='enrollment',
            field=models.ForeignKey(
                default=None, on_delete=django.db.models.deletion.CASCADE, to='accounts.enrollment'),
        ),
    ]
