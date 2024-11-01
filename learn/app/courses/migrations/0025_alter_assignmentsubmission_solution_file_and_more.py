# Generated by Django 4.2.3 on 2023-08-05 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0024_alter_assignment_assigment_file_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignmentsubmission',
            name='solution_file',
            field=models.FileField(
                upload_to='uploads/assignments/submissions'),
        ),
        migrations.AlterField(
            model_name='chapter',
            name='image',
            field=models.ImageField(
                blank=True, null=True, upload_to='uploads/chapters'),
        ),
        migrations.AlterField(
            model_name='classes',
            name='image',
            field=models.ImageField(
                blank=True, null=True, upload_to='uploads/classes'),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='thumb_url',
            field=models.ImageField(
                blank=True, null=True, upload_to='uploads/lessons'),
        ),
        migrations.AlterField(
            model_name='subject',
            name='image',
            field=models.ImageField(
                blank=True, null=True, upload_to='uploads/subjects'),
        ),
    ]
