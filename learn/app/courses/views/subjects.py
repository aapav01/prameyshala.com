from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils import timezone
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Subject
from ..forms import SubjectForm, SubjectChatperForm
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


class SubjectsView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_subject"
    model = Subject
    template_name = "subjects/index.html"
    form = SubjectForm
    context_object_name = "subjects"
    extra_context = {
        'title': 'Subjects',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Subjects'}],
        'form': form
    }
    paginate_by = 10
    ordering = ['-created_at']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = SubjectForm(instance=obj)
            obj.form = temp_form
        context['subject_filter'] = self.request.GET.get('subject', '')
        context['class_filter'] = self.request.GET.get('class', '')
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.publish_at = timezone.now()
            instance.slug = slugify(
                instance.standard.name + '_' + instance.name)
            instance.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': SubjectForm})
            return redirect('courses:subjects')
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

    # filter
    def get_queryset(self):
        queryset = super().get_queryset()
        subject_filter = self.request.GET.get('subject')
        class_filter = self.request.GET.get('class')

        all_subjects = Subject.objects.all().values('name').distinct()
        self.extra_context.update({'all_subjects': all_subjects})

        all_classes = Subject.objects.all().values(
            'standard__name', 'standard__slug').distinct()
        self.extra_context.update({'all_classes': all_classes})

        if subject_filter:
            queryset = queryset.filter(name__icontains=subject_filter)
        if class_filter:
            queryset = queryset.filter(standard__slug__icontains=class_filter)

        return queryset


class SubjectDetailView(PermissionRequiredMixin, DetailView):
    permission_required = "courses.view_subject"
    model = Subject
    template_name = "subjects/detail.html"
    context_object_name = "subject"
    extra_context = {
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'url': 'courses:subjects', 'label': 'Subjects'}, {}],
        'form_chapter': SubjectChatperForm,
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f"{self.object.name}"
        context['breadcrumbs'][3] = {'label': f"{self.object.name}"}
        context['form'] = SubjectForm(instance=self.object)
        context['chapters'] = self.object.chapter_set.all()
        return context

    def post(self, request, **kwargs):
        form = SubjectChatperForm(request.POST)
        self.extra_context.update({'form_chapter': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.subject = self.get_object()
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
            self.extra_context.update({'form_chapter': SubjectChatperForm})
            return redirect('courses:subject-detail', pk=self.get_object().pk)
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)


class SubjectUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_subject"
    model = Subject
    form_class = SubjectForm
    success_url = reverse_lazy("courses:subjects")
    template_name = "form.html"

    def form_valid(self, form):
        form.instance.slug = slugify(
            form.instance.standard.name + '_' + form.instance.name)
        messages.info(
            self.request, f'{form.instance.name} of {form.instance.standard.name} has been updated successfully.')
        return super().form_valid(form)


class SubjectDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_subject"
    model = Subject
    success_url = reverse_lazy("courses:subjects")

    def get(self, request, **kwargs):
        messages.error(request, 'Subject has been deleted successfully.')
        return self.delete(request, **kwargs)
