from django.core.management.base import BaseCommand
from django.utils.text import slugify

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from app.accounts.models import Role
from app.courses.models import Chapter, Subject, Classes, Lesson, Category


class Command(BaseCommand):
    help = "Populates the database with base generated data."

    def handle(self, *args, **options):
        standards = ["Class 9th"]
        subjects = ["Physics", "Chemistry", "Biology"]

        # There are 4 standards (9th, 10th, 11th, 12th)
        Classes_list = [
            Classes.objects.get_or_create(name=standard, description=standard, slug=slugify(standard)) for standard in standards
        ]

        # There are 4 category of subjects (Physics, Chemistry, Maths, Biology)
        Category_list = [Category.objects.get_or_create(
            name=category, description=category) for category in subjects]

        # Each standard has 4 subjects (Physics, Chemistry, Maths, Biology)
        Subject_list = [
            Subject.objects.get_or_create(name=subjects[j], description=subjects[j], slug=slugify(subjects[j]+'-' + Classes_list[i][0].name),
                                          standard=Classes_list[i][0], category=Category.objects.get(name=subjects[j])) for i in range(0, len(Classes_list)) for j in range(len(subjects))
        ]

        teacher_group, created = Role.objects.get_or_create(
            name="Teacher", description="Teacher")
        editor_group, created = Role.objects.get_or_create(
            name="Editor", description="Editor")
        publisher_group, created = Role.objects.get_or_create(
            name="Publisher", description="Publisher")

        classes_permission = Permission.objects.filter(
            content_type=ContentType.objects.get_for_model(Classes))
        subject_permission = Permission.objects.filter(
            content_type=ContentType.objects.get_for_model(Subject))
        chapter_permission = Permission.objects.filter(
            content_type=ContentType.objects.get_for_model(Chapter))
        lesson_permission = Permission.objects.filter(
            content_type=ContentType.objects.get_for_model(Lesson))

        for perm in lesson_permission:
            if perm.codename == "delete_lesson":
                publisher_group.permissions.add(perm)
            else:
                teacher_group.permissions.add(perm)
                editor_group.permissions.add(perm)
                publisher_group.permissions.add(perm)

        for perm in chapter_permission:
            if perm.codename == "delete_chapter":
                publisher_group.permissions.add(perm)
            elif perm.codename == "change_chapter":
                editor_group.permissions.add(perm)
                publisher_group.permissions.add(perm)
            else:
                teacher_group.permissions.add(perm)
                editor_group.permissions.add(perm)
                publisher_group.permissions.add(perm)

        for perm in subject_permission:
            if perm.codename == "delete_subject":
                publisher_group.permissions.add(perm)
            else:
                editor_group.permissions.add(perm)
                publisher_group.permissions.add(perm)

        for perm in classes_permission:
            if perm.codename == "delete_classes":
                publisher_group.permissions.add(perm)
            else:
                editor_group.permissions.add(perm)
                publisher_group.permissions.add(perm)

        self.stdout.write(self.style.SUCCESS(
            "Successfully populated the database."))
