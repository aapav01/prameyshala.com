# Generated by Django 4.2.10 on 2024-04-25 10:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0038_chapter_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizhash',
            name='current_grade',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='quizhash',
            name='last_attempted_question',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='last_attempted_question', to='courses.question'),
        ),
        migrations.AddField(
            model_name='quizhash',
            name='last_attempted_question_count',
            field=models.IntegerField(default=1),
        ),
    ]
