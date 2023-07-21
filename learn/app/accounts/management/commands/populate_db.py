import random
from datetime import datetime, timedelta

import pytz
from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from app.accounts.models import User, Enrollment, Payments
from app.courses.models import Chapter, Subject, Classes, Lesson


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
            Classes.objects.get_or_create(name=standard, description=standard, slug=slugify(standard)) for standard in standards
        ]

        # Each standard has 4 subjects (Physics, Chemistry, Maths, Biology)
        Subject_list = [
            Subject.objects.get_or_create(name=subject, description=subject, slug=slugify(subject+'-' + Classes_list[i][0].name),
                                          standard=Classes_list[i][0]) for i in range(0, len(Classes_list)) for subject in subjects
        ]

        amount = options["amount"] if options["amount"] else 100

        names = ["Aarav", "Anika", "Arjun", "Aryan", "Divya", "Esha", "Ishan", "Kavya", "Krish", "Maya",
                 "Neha", "Nikhil", "Pooja", "Rajesh", "Riya", "Rohan", "Sakshi", "Siddharth", "Tanvi", "Yash"]
        surname = ["Agarwal", "Bhatt", "Chaudhary", "Desai", "Gupta", "Iyer", "Jain", "Joshi", "Khanna",
                   "Kumar", "Mahajan", "Mehra", "Patel", "Rao", "Reddy", "Sharma", "Singh", "Verma", "Yadav", "Sharma"]

        password = make_password('password@123')
        admin_user = User.objects.get_or_create(phone_number="9876543210", email="admin@prameyshala.com",
                                                full_name="Admin User", password=password, is_staff=True, is_superuser=True)

        # Each subject has 10 chapters
        Chapters_list = [
            Chapter.objects.get_or_create(
                name=f"Chapter {i}", description=f"Chapter {i}", course=subject[0], user=admin_user[0])
            for i in range(1, 11) for subject in Subject_list
        ]

        users_list = []

        for _ in range(amount):
            phone_number = random.randint(6000000000, 9999999999)
            full_name = random.choice(names) + " " + random.choice(surname)
            email = f"{phone_number}@example.com"
            users_list.append(User.objects.get_or_create(
                full_name=full_name, phone_number=phone_number, password=password, email=email))

        for user in users_list:
            dt = pytz.utc.localize(datetime.now() - timedelta(days=random.randint(0, 1825)))
            user[0].created_at = dt
            user[0].updated_at = dt
            user[0].save()


        self.stdout.write(self.style.SUCCESS(
            "Successfully populated the database."))
