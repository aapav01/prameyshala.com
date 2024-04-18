from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
# from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Category
from ..forms import CategoriesForm


class CategoriesView(ListView):
    model = Category
    template_name = "categories/index.html"
    form = CategoriesForm
    context_object_name = "categories"
    extra_context = {
        'title': 'Categories',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Categories'}],
        'form': form
    }
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = CategoriesForm(instance=obj)
            obj.form = temp_form
        context['category_filter'] = self.request.GET.get('category', '')
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            # instance.slug = slugify(instance.name)
            instance.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': CategoriesForm})
            return redirect('courses:categories')
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

    # filter
    def get_queryset(self):
        queryset = super().get_queryset()
        category_name = self.request.GET.get('category')
        allcategories = Category.objects.all().values('name').distinct()
        self.extra_context.update({'allcategories': allcategories})
        if category_name:
            queryset = queryset.filter(name__icontains=category_name)
        return queryset


class CategoriesUpdateView(UpdateView):
    model = Category
    form_class = CategoriesForm
    success_url = reverse_lazy("courses:categories")
    template_name = "form.html"

    def form_valid(self, form):
        # form.instance.slug = slugify(form.instance.name)
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')
        return super().form_valid(form)


class CategoriesDeleteView(DeleteView):
    model = Category
    success_url = reverse_lazy("courses:categories")

    def get(self, request, **kwargs):
        messages.error(request, 'Category has been deleted successfully.')
        return self.delete(request, **kwargs)
