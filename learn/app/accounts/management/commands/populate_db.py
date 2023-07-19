import random
from datetime import datetime, timedelta

import pytz
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


        Classes_list = [
            Classes.objects.get_or_create(name=standard, description=standard, slug=slugify(standard)) for standard in standards
        ]

        # Each standard has 4 subjects (Physics, Chemistry, Maths, Biology)
        Subject_list = [
            Subject.objects.get_or_create(name=subject, description=subject, slug=slugify(subject+'-'+ Classes_list[i][0].name), standard=Classes_list[i][0]) for i in range(0, len(Classes_list)) for subject in subjects
        ]

        amount = options["amount"] if options["amount"] else 2500

        # for i in range(0, amount):
            # pass

