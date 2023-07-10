from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import Classes
from ..forms import ClassesForm


class ClassesView(ListView):
    model = Classes
    template_name = "classes/index.html"
    form = ClassesForm
    context_object_name = "classes"
    extra_context = {'title': 'Classes', 'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {
        'label': 'Courses'}, {'label': 'Classes'}], 'form': form}

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context['classes']:
            temp_form = ClassesForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            messages.success(request, 'Class has been created successfully.')
            form.save()
            form = self.form()
            return redirect('courses:classes')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))


class ClassesUpdateView(UpdateView):
    model = Classes
    fields = "__all__"
    success_url = reverse_lazy("courses:classes")

    def post(self, request, **kwargs):
        messages.info(request, 'Class has been updated successfully.')
        return super().post(request, **kwargs)


class ClassesDeleteView(DeleteView):
    model = Classes
    success_url = reverse_lazy("courses:classes")

    def get(self, request, **kwargs):
        messages.error(request, 'Class has been deleted successfully.')
        return self.delete(request, **kwargs)
