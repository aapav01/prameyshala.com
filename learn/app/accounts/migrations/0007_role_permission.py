# Generated by Django 4.2.3 on 2023-07-14 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('accounts', '0006_role_user_roles'),
    ]

    operations = [
        migrations.AddField(
            model_name='role',
            name='permission',
            field=models.ManyToManyField(to='auth.permission'),
        ),
    ]
