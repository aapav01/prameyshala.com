# Generated by Django 4.2.3 on 2023-07-31 18:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0019_rename_uploaded_at_assignment_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='category',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to='courses.category'),
        ),
        migrations.AlterField(
            model_name='subject',
            name='publish_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
