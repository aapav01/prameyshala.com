# Generated by Django 4.2.3 on 2023-07-10 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_alter_subject_publish_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='public',
            field=models.BooleanField(default=False),
        ),
    ]
