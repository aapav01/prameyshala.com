# Generated by Django 4.2.10 on 2024-04-13 16:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0020_phoneperesponse'),
    ]

    operations = [
        migrations.RunSQL(
            "ALTER TABLE accounts_user CONVERT TO CHARACTER SET utf8mb4;"
        ),
    ]