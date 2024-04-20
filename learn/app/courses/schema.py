from django.core.paginator import Paginator
import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload
from datetime import datetime
from app.accounts.models import User
from django.utils.timezone import now
from datetime import timedelta
from .models import Lesson, Subject, Classes, Chapter, Category, Quiz, Question, Choice, Assignment, AssignmentSubmission, Lesson_Progress, QuizHash, QuizHashQuestionAnswer, Grades, Enrollment
import random


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


class AssignmentType(DjangoObjectType):
    class Meta:
        model = Assignment
        fields = "__all__"


class ProgressType(DjangoObjectType):
    class Meta:
        model = Lesson_Progress
        fields = "__all__"


class QuizHashType(DjangoObjectType):
    class Meta:
        model = QuizHash
        fields = "__all__"


class QuizHashQuestionAnswerType(DjangoObjectType):
    class Meta:
        model = QuizHashQuestionAnswer
        fields = "__all__"


class GradesType(DjangoObjectType):
    class Meta:
        model = Grades
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
    lessons_by_preview = graphene.List(LessonType)

    # assignment
    assignment = graphene.List(
        AssignmentType, chapter=graphene.String(required=False))

    # progress
    progress = graphene.Field(ProgressType, lesson=graphene.ID(required=True))

    # quiz
    quiz = graphene.List(QuizType, id=graphene.ID(required=False))

    # quiz hash
    quiz_hash = graphene.Field(
        QuizHashType, quiz_id=graphene.ID(required=True))
    # quiz hash question answer
    quiz_hash_question_answer = graphene.Field(
        QuizHashQuestionAnswerType, quiz_hash_id=graphene.ID(required=True))

    # grades
    grades = graphene.List(GradesType, lesson_type=graphene.String(
        required=False), assignment_or_quiz_id=graphene.ID(required=False))

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

    def resolve_lesson_by_chapter_paginated(self, info, chapter_id, page=None):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        if User.objects.get(pk=user.id).enrollment_set.filter(standard__subject__chapter__id=chapter_id).count() == 0:
            raise Exception("You are not enrolled in this class")
        if not page:
            page = 1
        # Return Lesson
        lessons = Lesson.objects.filter(
            chapter=chapter_id, public=True).order_by('position')
        paginate_lessons = Paginator(lessons, per_page=1)
        page_obj = paginate_lessons.page(page)
        replaced_obj = paginate_lessons
        replaced_obj.lesson = page_obj.object_list[0]
        replaced_obj.has_next = page_obj.has_next()
        replaced_obj.has_previous = page_obj.has_previous()
        replaced_obj.start_index = page_obj.start_index()
        replaced_obj.end_index = page_obj.end_index()
        return replaced_obj

    def resolve_lessons_by_preview(self, info):
        lessons = Lesson.objects.filter(preview=True)
        return lessons

    # assignments
    def resolve_assignment(self, info, chapter=None):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        if chapter:
            return Assignment.objects.get(chapter__subject__name=chapter)
        return Assignment.objects.all()

    # progress
    def resolve_progress(self, info, lesson=None):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return Lesson_Progress.objects.get(lesson=lesson, student=user)

    # quiz
    def resolve_quiz(self, info, id=None):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        if id:
            return Quiz.objects.filter(pk=id)
        return Quiz.objects.all()

    # quiz hash
    def resolve_quiz_hash(self, info, quiz_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return QuizHash.objects.get(student=user, quiz=quiz_id)

    # quiz hash question answer
    def resolve_quiz_hash_question_answer(self, info, quiz_hash_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return QuizHashQuestionAnswerType.objects.get(quiz_hash=quiz_hash_id)

    # grades
    def resolve_grades(root, info, assignment_or_quiz_id=None, lesson_type=None):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        if lesson_type and lesson_type.lower() == "assignment":
            if assignment_or_quiz_id:
                assignment_grades = Grades.objects.filter(
                    student_id=user.id, assignment=assignment_or_quiz_id)
            else:
                assignment_grades = Grades.objects.filter(
                    student_id=user.id, assignment__lesson__lesson_type=lesson_type)
            return assignment_grades
        elif lesson_type and lesson_type.lower() == "quiz":
            if assignment_or_quiz_id:
                quiz_grades = Grades.objects.filter(
                    student_id=user.id, quiz=assignment_or_quiz_id)
            else:
                quiz_grades = Grades.objects.filter(
                    student_id=user.id, quiz__lesson__lesson_type=lesson_type)
            return quiz_grades
        else:
            return Grades.objects.filter(student_id=user.id)


class CreateAssignmentSubmission(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        solution = Upload(required=True)
        assignment_id = graphene.ID(required=True)

    def mutate(root, info, solution):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        submission = AssignmentSubmission(
            student_id=user,
            solution_file=solution,
        )
        submission.save()
        return CreateAssignmentSubmission(success=True)


class CreateProgress(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        progress = graphene.Float(required=True)
        lessonID = graphene.ID(required=True)

    def mutate(root, info, progress, lessonID):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        completed = False
        if progress == 1.0:
            completed = True
        if not Lesson_Progress.objects.filter(lesson__id=lessonID).exists():

            progress_record = Lesson_Progress(
                student_id=user.id,
                progress=progress,
                lesson_id=lessonID,
                lesson_completed=completed
            )
            progress_record.save()
        else:
            progress_instance = Lesson_Progress.objects.get(
                lesson__id=lessonID)
            if not progress_instance.lesson_completed:
                progress_instance.progress = progress
                if completed:
                    progress_instance.lesson_completed = completed
                progress_instance.save()
        return CreateProgress(success=True)


class StartOrResumeQuiz(graphene.Mutation):
    class Arguments:
        quiz_id = graphene.ID(required=True)

    quiz_hash = graphene.Field(QuizHashType)
    created = graphene.Boolean()
    time_left = graphene.Int()

    def mutate(root, info, quiz_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required")
        quiz = Quiz.objects.get(pk=quiz_id)
        created = False
        threshold_time = now() - timedelta(minutes=quiz.time_required)
        existing_quiz_hash = QuizHash.objects.filter(
            quiz=quiz,
            student=user,
            start_time__gte=threshold_time
        ).first()
        if existing_quiz_hash and not existing_quiz_hash.quiz_ended:
            quiz_hash = existing_quiz_hash
        else:
            quiz_hash = QuizHash.objects.create(
                quiz=quiz,
                student=user,
            )
            created = True
            questions = list(quiz.question_set.all())
            random.shuffle(questions)  # Randomly shuffle the questions
            for index, question in enumerate(questions, start=1):
                QuizHashQuestionAnswer.objects.create(
                    quiz_hash=quiz_hash,
                    question=question,
                    question_order=index
                )
        elapsed_time = now() - quiz_hash.start_time
        total_duration = timedelta(minutes=quiz.time_required)
        time_left = total_duration - elapsed_time
        return StartOrResumeQuiz(quiz_hash=quiz_hash, created=created, time_left=int(time_left.total_seconds()))


class SubmitAnswerToQuiz(graphene.Mutation):
    class Arguments:
        quiz_hash_id = graphene.String(required=True)
        question_id = graphene.ID(required=True)
        chosen_answer_id = graphene.ID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, quiz_hash_id, question_id, chosen_answer_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        quiz_hash = QuizHash.objects.get(pk=quiz_hash_id)
        question = Question.objects.get(pk=question_id)
        chosen_answer = Choice.objects.get(pk=chosen_answer_id)

        QuizHashQuestionAnswer.objects.filter(
            quiz_hash=quiz_hash,
            question=question
        ).update(
            chosen_answer=chosen_answer
        )

        return SubmitAnswerToQuiz(success=True)


class EndQuiz(graphene.Mutation):
    class Arguments:
        quiz_hash_id = graphene.String(required=True)

    success = graphene.Boolean()
    quiz_hash_question_answer = graphene.ID()

    def mutate(self, info, quiz_hash_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        quiz_hash = QuizHash.objects.get(pk=quiz_hash_id)
        quiz_hash.quiz_ended = True
        quiz_hash.save()
        quiz_hash_question_answer = QuizHashQuestionAnswer.objects.get(
            quiz_hash=quiz_hash_id)
        return EndQuiz(success=True, quiz_hash_question_answer=quiz_hash_question_answer)


class Mutation(graphene.ObjectType):
    create_submission = CreateAssignmentSubmission.Field()
    create_progress = CreateProgress.Field()
    start_or_resume_quiz = StartOrResumeQuiz.Field()
    submit_answer = SubmitAnswerToQuiz.Field()
    end_quiz = EndQuiz.Field()
