# Generated by Django 4.2.3 on 2023-07-23 08:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0013_classes_before_price_classes_latest_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='popular',
            field=models.BooleanField(default=False),
        ),
    ]
