from django.contrib import messages
from django.shortcuts import render, redirect
from django.views import View
from ..models import Chapter
from ..forms import *


class ChapterView(View):
    model = Chapter
    template_name = "chapters/index.html"
    form = ChapterForm
    title = 'Chapters'
    breadcrumbs = [{'url': 'core:home',
                    'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Classes'}]
    context = {
        'title': title,
        'breadcrumbs': breadcrumbs,
    }

    # list
    def get(self, request):
        chapters = self.model.objects.all()
        self.context.update({'chapters': chapters})
        self.context.update({'form': self.form})
        return render(request, self.template_name, self.context)

    # create
    def post(self, request):
        form = self.form(request.POST)
        self.context.update({'form': form})
        if form.is_valid():
            messages.success(request, 'Chapter created successfully.')
            form.save()
            return redirect('courses:chapters')
        else:
            return render(request, self.template_name, self.context)

    # update
    def put(self, request, pk):
        pass
        #todo: not tested yet
        chapter = self.model.objects.get(pk=pk)
        form = self.form(request.POST, instance=chapter)
        self.context.update({'form': form})
        if form.is_valid():
            messages.success(request, 'Chapter updated successfully.')
            form.save()
            return redirect('courses:chapters')
        else:
            return render(request, self.template_name, self.context)

    # delete
    def delete(self, request, pk):
        pass
        #todo: not tested yet
        chapter = self.model.objects.get(pk=pk)
        chapter.delete()
        messages.success(request, 'Chapter deleted successfully.')
        return redirect('courses:chapters')
