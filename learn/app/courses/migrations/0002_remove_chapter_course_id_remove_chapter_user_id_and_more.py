# Generated by Django 4.2.3 on 2023-07-09 15:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chapter',
            name='course_id',
        ),
        migrations.RemoveField(
            model_name='chapter',
            name='user_id',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='chapter_id',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='user_id',
        ),
        migrations.RemoveField(
            model_name='subject',
            name='standard_id',
        ),
        migrations.AddField(
            model_name='chapter',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.subject'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='chapter',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lesson',
            name='chapter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.chapter'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lesson',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='subject',
            name='standard',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.classes'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='chapter',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='subject',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='subject',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]
