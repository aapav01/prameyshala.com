from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Lesson
from ..forms import LessonForm
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

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
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
            return render(request, self.template_name, self.get_context_data(**kwargs))

class LessonDetailView(PermissionRequiredMixin, DetailView):
    permission_required = "courses.view_lesson"
    model = Lesson
    template_name = "lessons/detail.html"
    context_object_name = "lesson"
    extra_context = {
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'},{'label': 'Courses'}, {'url': 'courses:lessons', 'label': 'Lessons'},{}],
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['breadcrumbs'][3]={'label': context['lesson'].title}
        context['title'] = context['lesson'].title
        context['form'] = LessonForm(instance=context['lesson'], prefix=context['lesson'].pk)
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


class LessonDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_lesson"
    model = Lesson
    success_url = reverse_lazy("courses:lessons")

    def get(self, request, **kwargs):
        messages.error(request, 'Lesson has been deleted successfully.')
        return self.delete(request, **kwargs)
