# Generated by Django 4.2.3 on 2023-07-26 07:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0016_alter_question_question_text'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='category',
            table='categories',
        ),
        migrations.AlterModelTable(
            name='choice',
            table='choices',
        ),
        migrations.AlterModelTable(
            name='question',
            table='questions',
        ),
        migrations.AlterModelTable(
            name='quiz',
            table='quizzes',
        ),
    ]