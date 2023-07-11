# Generated by Django 4.2.3 on 2023-07-10 01:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_alter_chapter_image_alter_classes_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chapter',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='static/uploads/chapters'),
        ),
        migrations.AlterField(
            model_name='classes',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='static/uploads/classes'),
        ),
        migrations.AlterField(
            model_name='classes',
            name='slug',
            field=models.SlugField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='thumb_url',
            field=models.ImageField(blank=True, null=True, upload_to='static/uploads/lessons'),
        ),
        migrations.AlterField(
            model_name='subject',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='static/uploads/subjects'),
        ),
        migrations.AlterField(
            model_name='subject',
            name='slug',
            field=models.SlugField(max_length=255, unique=True),
        ),
    ]