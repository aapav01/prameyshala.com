from typing import Any
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.db.models.query import QuerySet
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.timezone import now
from django.urls import reverse_lazy
from django.db.models import Q
from ..models import Lesson
from ..forms import LessonForm
import requests
import environ
import hashlib


# Initialise environment variables
env = environ.Env()
environ.Env.read_env()

headers = {
    "accept": "application/json",
    "content-type": "application/*+json",
    "AccessKey": env('BUNNYCDN_ACCESS_KEY')
}


class LessonView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_lesson"
    model = Lesson
    template_name = "lessons/index.html"
    form = LessonForm
    context_object_name = "lessons"
    extra_context = {
        'title': 'Lessons',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Lessons'}],
        'form': form
    }
    paginate_by = 10
    ordering = ['-created_at']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('search', '')
        for obj in context[self.context_object_name]:
            temp_form = LessonForm(instance=obj, prefix=obj.pk)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.created_by = request.user
            if instance.chapter.collectionid is None:
                collectionid = ''
            else:
                collectionid = instance.chapter.collectionid
            if instance.platform == "file":
                url = f"https://video.bunnycdn.com/library/{env('BUNNYCDN_VIDEO_LIBRARY_ID')}/videos"
                payload = "{\"title\":\""+instance.title + \
                    "\",\"collectionId\":\""+collectionid+"\"}"
                response = requests.post(url, data=payload, headers=headers)
                print(response.text)
                if response.status_code == 200:
                    instance.platform_video_id = response.json()['guid']
                    messages.success(
                        request, 'BunnyCDN Video has been created successfully.')
            instance.save()
            messages.success(
                request, f'{instance.title} has been created successfully.')
            self.extra_context.update({'form': LessonForm})
            return redirect('courses:lessons')
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

    # search
    def get_queryset(self):
        queryset = super().get_queryset()

        class_filter = self.request.GET.get('class')
        subject_filter = self.request.GET.get('subject')
        search_query = self.request.GET.get('search')

        all_subjects = Lesson.objects.all().values('chapter__subject__name').distinct()
        self.extra_context.update({'all_subjects': all_subjects})

        all_classes = Lesson.objects.all().values(
            'chapter__subject__standard__name').distinct()
        self.extra_context.update({'all_classes': all_classes})

        if class_filter:
            queryset = queryset.filter(
                chapter__subject__standard__name__icontains=class_filter)

        if subject_filter:
            queryset = queryset.filter(
                chapter__subject__name__icontains=subject_filter)

        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(lesson_type__icontains=search_query) |
                Q(chapter__name__icontains=search_query) |
                Q(chapter__subject__name__icontains=search_query) |
                Q(chapter__subject__standard__name__icontains=search_query)
            )

        return queryset


class LessonDetailView(PermissionRequiredMixin, DetailView):
    permission_required = "courses.view_lesson"
    model = Lesson
    template_name = "lessons/detail.html"
    context_object_name = "lesson"
    extra_context = {
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'url': 'courses:lessons', 'label': 'Lessons'}, {}],
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['breadcrumbs'][3] = {'label': context['lesson'].title}
        context['title'] = context['lesson'].title
        context['form'] = LessonForm(
            instance=context['lesson'], prefix=context['lesson'].pk)
        context['collectionID'] = context['lesson'].chapter.collectionid if context['lesson'].chapter.collectionid is not None else ''
        # SHA256 signature (library_id + api_key + expiration_time + video_id)
        expiration_time = int(now().timestamp()) + 86400
        if context['lesson'].platform_video_id is None and context['lesson'].platform != "file":
            context['lesson'].platform_video_id = ''
        hash_string = env('BUNNYCDN_VIDEO_LIBRARY_ID') + env('BUNNYCDN_ACCESS_KEY') + \
            str(expiration_time) + context['lesson'].platform_video_id
        sha = hashlib.sha256(hash_string.encode()).hexdigest()
        context['sha256'] = sha
        context['expiration_time'] = expiration_time
        context['LibraryId'] = env('BUNNYCDN_VIDEO_LIBRARY_ID', cast=int)
        return context


class LessonUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_lesson"
    model = Lesson
    form_class = LessonForm
    success_url = reverse_lazy("courses:lessons")
    template_name = "form.html"

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        prefix = self.kwargs.get('pk')
        kwargs['prefix'] = prefix
        return kwargs

    def form_valid(self, form):
        form.instance.updated_by = self.request.user
        messages.info(
            self.request, f'{form.instance.title} of {form.instance.chapter.name} has been updated successfully.')
        return super().form_valid(form)


def lesson_status_update(request, pk):
    lesson = Lesson.objects.get(pk=pk)
    lesson.status = request.POST.get('status')
    lesson.save()
    messages.info(
        request, f'{lesson.title} of {lesson.chapter.name} has been updated successfully.')
    return redirect('courses:lesson-detail', pk=pk)


class LessonDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_lesson"
    model = Lesson
    success_url = reverse_lazy("courses:lessons")

    def get(self, request, **kwargs):
        super().get(request, **kwargs)
        if self.object.platform == "file":
            url = f"https://video.bunnycdn.com/library/{env('BUNNYCDN_VIDEO_LIBRARY_ID')}/videos/{self.object.platform_video_id}"
            response = requests.delete(url, headers=headers)
            print(response.text)
            if response.status_code == 200:
                messages.error(
                    self.request, 'BunnyCDN Video has been deleted successfully.')
        messages.error(request, 'Lesson has been deleted successfully.')
        return self.delete(request, **kwargs)
