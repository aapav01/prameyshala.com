import graphene
from graphene_django import DjangoObjectType
from .models import Lesson, Subject, Classes, Chapter


class ChapterType(DjangoObjectType):
    class Meta:
        model = Chapter
        fields = "__all__"


class ClassesType(DjangoObjectType):
    class Meta:
        model = Classes
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
    standard = graphene.Field(ClassesType, id=graphene.Int(required=True))
    # subjects
    subjects = graphene.List(SubjectType)
    subject = graphene.Field(SubjectType, id=graphene.Int(required=True))
    # chapters
    chapters = graphene.List(ChapterType)
    chapter = graphene.Field(ChapterType, id=graphene.Int(required=True))
    # lessons
    lessons = graphene.List(LessonType)
    lesson = graphene.Field(LessonType, id=graphene.Int(required=True))

    # classes
    def resolve_classes(self, info):
        return Classes.objects.all()

    def resolve_standard(self, info, id):
        return Classes.objects.get(pk=id)

    # subjects
    def resolve_subjects(self, info):
        return Subject.objects.all()

    def resolve_subject(self, info, id):
        return Subject.objects.get(pk=id)

    # chapters
    def resolve_chapters(self, info):
        return Chapter.objects.all()

    def resolve_chapter(self, info, id):
        return Chapter.objects.get(pk=id)

    # lessons
    def resolve_lessons(self, info):
        return Lesson.objects.all()

    def resolve_lesson(self, info, id):
        return Lesson.objects.get(pk=id)