# Generated by Django 4.2.11 on 2024-06-05 06:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0042_alter_grades_grade'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='chapter',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='courses.chapter'),
        ),
    ]
