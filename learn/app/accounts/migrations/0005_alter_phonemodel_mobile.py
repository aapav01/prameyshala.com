# Generated by Django 4.2.3 on 2023-07-12 10:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_phonemodel'),
    ]

    operations = [
        migrations.AlterField(
            model_name='phonemodel',
            name='Mobile',
            field=models.BigIntegerField(),
        ),
    ]
