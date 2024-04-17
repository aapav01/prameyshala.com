# Generated by Django 4.2.3 on 2023-07-12 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0009_lesson_teacher_lesson_updated_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='platform',
            field=models.CharField(blank=True, choices=[('file', 'File'), (
                'youtube', 'Youtube'), ('vimeo', 'Vimeo')], default=None, max_length=11, null=True),
        ),
    ]
