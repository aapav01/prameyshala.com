from typing import Any
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.db.models.query import QuerySet
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import Chapter
from ..forms import ChapterForm
from django.db.models import Q
import requests
import environ


# Initialise environment variables
env = environ.Env()
environ.Env.read_env()

headers = {
    "accept": "application/json",
    "content-type": "application/*+json",
    "AccessKey": env('BUNNYCDN_ACCESS_KEY')
}


class ChapterView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_chapter"
    model = Chapter
    template_name = "chapters/index.html"
    form = ChapterForm
    context_object_name = "chapters"
    extra_context = {
        'title': 'Chapters',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Chapters'}],
        'form': form
    }
    paginate_by = 10
    ordering = ['-created_at']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = ChapterForm(instance=obj)
            obj.form = temp_form
        context['class_filter'] = self.request.GET.get('class', '')
        context['chapter_filter'] = self.request.GET.get('chapter', '')
        context['subject_filter'] = self.request.GET.get('subject', '')
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            try:
                payload = '{"name\":\"'+instance.name + ' - ' + \
                    instance.subject.name + ' - ' + instance.subject.standard.name + '\"}'
                response = requests.post(
                    f"https://video.bunnycdn.com/library/{env('BUNNYCDN_VIDEO_LIBRARY_ID')}/collections", data=payload, headers=headers)

                if response.status_code == 200:
                    instance.collectionid = response.json()['guid']
                else:
                    messages.error(
                        request, f'Error creating collection on BunnyCDN. {response.json()["title"]}')
            except Exception as e:
                print(e)
            instance.user = request.user
            instance.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': ChapterForm})
            return redirect('courses:chapters')
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()

        class_filter = self.request.GET.get('class')
        chapter_filter = self.request.GET.get('chapter')
        subject_filter = self.request.GET.get('subject')

        all_subjects = Chapter.objects.all().values('subject__name').distinct()
        self.extra_context.update({'all_subjects': all_subjects})

        all_classes = Chapter.objects.all().values('subject__standard__name').distinct()
        self.extra_context.update({'all_classes': all_classes})

        if class_filter:
            queryset = queryset.filter(subject__standard__name__icontains=class_filter)

        if chapter_filter:
            queryset = queryset.filter(name__icontains=chapter_filter)

        if subject_filter:
            queryset = queryset.filter(subject__name__icontains=subject_filter)

        return queryset


class ChapterDetailView(PermissionRequiredMixin, DetailView):
    permission_required = "courses.view_chapter"
    model = Chapter
    template_name = "chapters/detail.html"
    extra_context = {
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'url': 'courses:chapters', 'label': 'Chapters'}, {}],
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f"{self.object.name}"
        context['breadcrumbs'][3] = {'label': f"{self.object.name}"}
        context['lessons'] = self.object.lesson_set.all()
        context['form'] = ChapterForm(instance=self.object)
        return context


class ChapterUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_chapter"
    model = Chapter
    form_class = ChapterForm
    success_url = reverse_lazy("courses:chapters")
    template_name = "form.html"

    def form_valid(self, form):
        if form.instance.collectionid is None:
            try:
                payload = '{"name\":\"'+form.instance.name + ' - ' + \
                    form.instance.subject.name + ' - ' + form.instance.subject.standard.name + '\"}'
                response = requests.post(
                    f"https://video.bunnycdn.com/library/{env('BUNNYCDN_VIDEO_LIBRARY_ID')}/collections", data=payload, headers=headers)

                if response.status_code == 200:
                    form.instance.collectionid = response.json()['guid']
                else:
                    messages.error(
                        self.request, f'Error creating collection on BunnyCDN. {response.json()["title"]}')
            except Exception as e:
                print(e)

        messages.info(
            self.request, f'{form.instance.name} of {form.instance.subject.name} has been updated successfully.')
        return super().form_valid(form)


class ChapterDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_chapter"
    model = Chapter
    success_url = reverse_lazy("courses:chapters")

    def get(self, request, **kwargs):
        messages.error(request, 'Chapter has been deleted successfully.')
        return self.delete(request, **kwargs)

    def form_vaild(self, form):
        if form.instance.collectionid is not None:
            try:
                response = requests.delete(
                    f"https://video.bunnycdn.com/library/{env('BUNNYCDN_VIDEO_LIBRARY_ID')}/collections/{form.instance.collectionid}", headers=headers)
                if response.status_code == 200:
                    messages.info(
                        self.request, f'Collection {form.instance.name} has been deleted successfully.')
                else:
                    messages.error(
                        self.request, f'Error deleting collection on BunnyCDN. {response.json()["title"]}')
            except Exception as e:
                print(e)
            messages.info(
                self.request, f'{form.instance.name} of {form.instance.subject.name} has been deleted successfully.')
        return super().form_valid(form)
