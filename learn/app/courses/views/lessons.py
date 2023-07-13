from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView
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


class LessonView(ListView):
    model = Lesson
    template_name = "lessons/index.html"
    form = LessonForm
    context_object_name = "lessons"
    extra_context = {
        'title': 'Lessons',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Lessons'}],
        'form': form
    }

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
            if instance.platform == "file":
                url = f"https://video.bunnycdn.com/library/{env('BUNNYCDN_VIDEO_LIBRARY_ID')}/videos"
                payload = "{\"title\":\""+instance.title + \
                    "\",\"collectionId\":\""+instance.chapter.collectionid+"\"}"
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


class LessonUpdateView(UpdateView):
    model = Lesson
    form_class = LessonForm
    success_url = reverse_lazy("courses:lessons")

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


class LessonDeleteView(DeleteView):
    model = Lesson
    success_url = reverse_lazy("courses:lessons")

    def get(self, request, **kwargs):
        messages.error(request, 'Lesson has been deleted successfully.')
        return self.delete(request, **kwargs)
