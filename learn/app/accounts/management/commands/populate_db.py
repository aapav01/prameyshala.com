import random
from datetime import datetime, timedelta

import pytz
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

from app.accounts.models import User, Enrollment, Payments, Role
from app.courses.models import Chapter, Subject, Classes, Lesson, Category


class Command(BaseCommand):
    help = "Populates the database with random generated data."

    def add_arguments(self, parser):
        parser.add_argument(
            "--amount", type=int, help="The number of purchases that should be created.")

    def handle(self, *args, **options):
        standards = ["Class 9th", "Class 10th", "Class 11th", "Class 12th"]
        subjects = ["Physics", "Chemistry", "Maths", "Biology"]

        # There are 4 standards (9th, 10th, 11th, 12th)
        Classes_list = [
            Classes.objects.get_or_create(name=standard, description=standard, slug=slugify(standard), latest_price=random.randint(1000, 10000)) for standard in standards
        ]

        # There are 4 category of subjects (Physics, Chemistry, Maths, Biology)
        Category_list = [Category.objects.get_or_create(
            name=category, description=category) for category in subjects]

        # Each standard has 4 subjects (Physics, Chemistry, Maths, Biology)
        Subject_list = [
            Subject.objects.get_or_create(name=subjects[j], description=subjects[j], slug=slugify(subjects[j]+'-' + Classes_list[i][0].name),
                                          standard=Classes_list[i][0], category=Category.objects.get(name=subjects[j])) for i in range(0, len(Classes_list)) for j in range(len(subjects))
        ]

        amount = options["amount"] if options["amount"] else 100

        names = ["Aarav", "Anika", "Arjun", "Aryan", "Divya", "Esha", "Ishan", "Kavya", "Krish", "Maya",
                 "Neha", "Nikhil", "Pooja", "Rajesh", "Riya", "Rohan", "Sakshi", "Siddharth", "Tanvi", "Yash"]
        surname = ["Agarwal", "Bhatt", "Chaudhary", "Desai", "Gupta", "Iyer", "Jain", "Joshi", "Khanna",
                   "Kumar", "Mahajan", "Mehra", "Patel", "Rao", "Reddy", "Sharma", "Singh", "Verma", "Yadav", "Sharma"]

        password = make_password('password@123')
        admin_user = User.objects.get_or_create(phone_number="+919876543210", email="admin@prameyshala.com",
                                                full_name="Admin User", password=password, is_staff=True, is_superuser=True)

        # Each subject has 10 chapters
        Chapters_list = [
            Chapter.objects.get_or_create(
                name=f"Chapter {i}", description=f"Chapter {i}", subject=subject[0], user=admin_user[0])
            for i in range(1, 11) for subject in Subject_list
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

        users_list = []

        for _ in range(amount):
            phone_number = "+91" + str(random.randint(9999000000, 9999999999))
            full_name = random.choice(names) + " " + random.choice(surname)
            email = f"{phone_number}@example.com"
            users_list.append(User.objects.get_or_create(
                full_name=full_name, phone_number=phone_number, password=password, email=email))

        for user in users_list:
            dt = pytz.utc.localize(
                datetime.now() - timedelta(days=random.randint(0, 740)))
            user[0].created_at = dt
            user[0].updated_at = dt
            user[0].save()

        speical_users = []
        for i in range(20):
            phone_number = "+91" + str(random.randint(8000000000, 9799999999))
            full_name = random.choice(names) + " " + random.choice(surname)
            email = f"{phone_number}@example.com"
            user = User.objects.get_or_create(
                full_name=full_name, phone_number=phone_number, password=password, email=email, is_staff=True, is_superuser=False)
            if i < 16:
                teacher_group.user_set.add(user[0])
            else:
                type_of_user = random.choice((editor_group, publisher_group))
                type_of_user.user_set.add(user[0])
            speical_users.append(user)

        payment_method_list = ['Debit Card', 'UPI', 'Credit Card']
        payment_status = ['attempted', 'paid']

        # Selecting random users to make them enrolled.
        enrolled_list = []
        for user in users_list:
            new_subscription = user[0].created_at + timedelta(days=365)
            standard = random.choice(Classes_list)
            payment = Payments.objects.get_or_create(
                gateway='FAKE DATA',
                method=random.choice(payment_method_list),
                status=random.choice(payment_status),
                user=user[0],
                amount=standard[0].latest_price,
                json_response='{ "fake": "data" }',
            )
            payment[0].created_at = user[0].created_at
            payment[0].updated_at = user[0].created_at
            payment[0].save()
            if (payment[0].status == 'paid'):
                enrollment = Enrollment.objects.get_or_create(
                    user=user[0], standard=standard[0], payment=payment[0], expiration_date=new_subscription
                )
                enrollment[0].created_at = user[0].created_at
                enrollment[0].updated_at = user[0].created_at
                enrollment[0].save()
                enrolled_list.append(enrollment[0])

        self.stdout.write(self.style.SUCCESS(
            "Successfully populated the database."))
