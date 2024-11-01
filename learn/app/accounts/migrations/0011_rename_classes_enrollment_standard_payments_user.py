# Generated by Django 4.2.3 on 2023-07-23 11:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0010_rename_classes_id_enrollment_classes_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='enrollment',
            old_name='classes',
            new_name='standard',
        ),
        migrations.AddField(
            model_name='payments',
            name='user',
            field=models.ForeignKey(
                default='', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
