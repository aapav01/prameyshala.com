# Generated by Django 4.2.3 on 2023-07-26 06:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0015_question_quiz_choice'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='question_text',
            field=models.TextField(),
        ),
    ]
