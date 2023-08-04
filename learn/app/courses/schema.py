import graphene
from graphene_django import DjangoObjectType
from datetime import datetime
from .models import Lesson, Subject, Classes, Chapter, Category


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
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
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
