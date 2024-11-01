# Generated by Django 4.2.3 on 2023-08-04 06:50

from django.db import migrations, models
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0015_user_city_user_country_user_state_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='phonemodel',
            name='Mobile',
            field=phonenumber_field.modelfields.PhoneNumberField(
                max_length=20, region=None),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(max_length=16, unique=True),
        ),
    ]
