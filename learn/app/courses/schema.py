from django.core.paginator import Paginator
import graphene
from graphene_django import DjangoObjectType
from datetime import datetime
from app.accounts.models import User
from .models import Lesson, Subject, Classes, Chapter, Category, Quiz, Question, Choice


class ChapterType(DjangoObjectType):
    class Meta:
        model = Chapter
        fields = "__all__"


class ClassesType(DjangoObjectType):
    class Meta:
        model = Classes
        fields = "__all__"


class CategoriesType(DjangoObjectType):
    class Meta:
        model = Category
        fields = "__all__"


class SubjectType(DjangoObjectType):
    class Meta:
        model = Subject
        fields = "__all__"


class LessonType(DjangoObjectType):
    class Meta:
        model = Lesson
        fields = "__all__"

class QuizType(DjangoObjectType):
    class Meta:
        model = Quiz
        fields = "__all__"

class QuestionType(DjangoObjectType):
    class Meta:
        model = Question
        fields = "__all__"

class ChoiceType(DjangoObjectType):
    class Meta:
        model = Choice
        fields = "__all__"


class PaginatedLessons(graphene.ObjectType):
    count = graphene.Int()
    num_pages = graphene.Int()
    lesson = graphene.Field(LessonType)
    has_next = graphene.Boolean()
    has_previous = graphene.Boolean()
    start_index = graphene.Int()
    end_index = graphene.Int()


class Query(graphene.ObjectType):
    # classes
    classes = graphene.List(ClassesType)
    standard = graphene.Field(ClassesType, slug=graphene.String(required=True))
    # category
    categories = graphene.List(CategoriesType, popular=graphene.Boolean())
    category = graphene.Field(CategoriesType, id=graphene.ID(required=True))

    # subjects
    subject = graphene.Field(SubjectType, slug=graphene.String(required=True))
    # chapters
    chapter = graphene.Field(ChapterType, id=graphene.ID(required=True))
    # lessons
    lesson = graphene.Field(LessonType, id=graphene.ID(required=True))
    lesson_by_chapter_paginated = graphene.Field(
        PaginatedLessons, chapter_id=graphene.ID(required=True), page=graphene.Int())

    # classes
    def resolve_classes(self, info):
        return Classes.objects.filter(publish_at__lte=datetime.now())

    def resolve_standard(self, info, slug):
        return Classes.objects.get(slug=slug)

    # categories
    def resolve_categories(self, info, popular=None):
        if popular is not None:
            return Category.objects.filter(popular=popular).all()
        return Category.objects.all()

    def resolve_category(self, info, id):
        return Category.objects.get(pk=id)

    # subjects
    def resolve_subject(self, info, slug):
        return Subject.objects.get(slug=slug)

    # chapters
    def resolve_chapter(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return Chapter.objects.get(pk=id)

    # lessons
    def resolve_lesson(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return Lesson.objects.filter(public=True).get(pk=id)

    def resolve_lesson_by_chapter_paginated(self, info, chapter_id, page=1):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        # Check if user is enrolled ( user -> enrollment -> classes )
        # in the class (lesson < chapter < subject < class) and can access the lesson
        # if not, raise an error
        # if user is enrolled, return the lesson
        if User.objects.get(pk=user.id).enrollment_set.filter(standard__subject__chapter__id=chapter_id).count() == 0:
            raise Exception("You are not enrolled in this class")
        # Return Lesson
        lessons = Lesson.objects.filter(chapter=chapter_id, public=True).order_by('position')
        paginate_lessons = Paginator(lessons, per_page=1)
        page_obj = paginate_lessons.page(page)
        replaced_obj = paginate_lessons
        replaced_obj.lesson = page_obj.object_list[0]
        replaced_obj.has_next = page_obj.has_next()
        replaced_obj.has_previous = page_obj.has_previous()
        replaced_obj.start_index = page_obj.start_index()
        replaced_obj.end_index = page_obj.end_index()
        return replaced_obj
