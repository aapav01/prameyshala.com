# Generated by Django 4.2.3 on 2023-07-11 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0006_alter_lesson_public'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='description',
            field=models.TextField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='lesson_type',
            field=models.CharField(choices=[('None', '---------'), ('video', 'Video'), ('document', 'Document'), (
                'audio', 'Audio'), ('image', 'Image'), ('text', 'Text')], db_column='type', default=None, max_length=8),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='platform',
            field=models.CharField(blank=True, choices=[('None', '---------'), ('file', 'File'), (
                'youtube', 'Youtube'), ('vimeo', 'Vimeo')], default=None, max_length=11, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='position',
            field=models.IntegerField(blank=True, default=9999, null=True),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='status',
            field=models.CharField(choices=[('created', 'Created'), ('pending', 'Pending'), ('uploading', 'Uploading'), (
                'processing', 'Processing'), ('ready', 'Ready'), ('error', 'Error')], default='created', max_length=10),
        ),
    ]
