# Generated by Django 4.2.3 on 2023-08-03 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_alter_enrollment_expiration_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='phonemodel',
            name='Mobile',
            field=models.CharField(max_length=20),
        ),
    ]
