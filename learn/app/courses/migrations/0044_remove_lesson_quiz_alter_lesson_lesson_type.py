# Generated by Django 4.2.11 on 2024-06-05 06:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0043_quiz_chapter'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='quiz',
        ),
        migrations.AlterField(
            model_name='lesson',
            name='lesson_type',
            field=models.CharField(choices=[('None', '---------'), ('video', 'Video'), ('document', 'Document'), ('assignment', 'Assignment')], db_column='type', default=None, max_length=12),
        ),
    ]