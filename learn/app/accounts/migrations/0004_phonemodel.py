# Generated by Django 4.2.3 on 2023-07-12 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_enrollment_created_at_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='phoneModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('Mobile', models.IntegerField()),
                ('isVerified', models.BooleanField(default=False)),
                ('counter', models.IntegerField(default=0)),
            ],
        ),
    ]
