# Generated by Django 4.2.3 on 2023-07-27 03:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_payments_order_gateway_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='enrollment',
            name='expiration_date',
            field=models.DateField(blank=True, default=None, null=True),
        ),
    ]