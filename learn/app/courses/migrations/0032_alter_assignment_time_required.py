# Generated by Django 4.2.3 on 2023-10-02 05:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0031_remove_assignment_due_date_assignment_time_required'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assignment',
            name='time_required',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]