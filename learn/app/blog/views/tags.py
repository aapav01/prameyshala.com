from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from django.db.models import Count
from ..models import Tag
from ..forms import TagForm


class TagsView(PermissionRequiredMixin, ListView):
    permission_required = "blog.view_tags"
    model = Tag
    template_name = "tags/index.html"
    form = TagForm
    context_object_name = "tags"
    extra_context = {
        'title': 'Tags',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Blog'}, {'label': 'Tags'}],
        'form': form
    }
    paginate_by = 10
    ordering = ['name']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context['tags']:
            temp_form = TagForm(instance=obj, prefix=obj.pk)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.slug = slugify(instance.name)
            instance.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': TagForm})
            return redirect('blog:tags')
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(name__icontains=search_query)

        return queryset


class TagsUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "blog.change_tags"
    model = Tag
    form_class = TagForm
    success_url = reverse_lazy("blog:tags")
    template_name = "form.html"

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        prefix = self.kwargs.get('pk')
        kwargs['prefix'] = prefix
        return kwargs

    def form_valid(self, form):
        form.instance.slug = slugify(form.instance.name)
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')
        return super().form_valid(form)


class TagsDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "blog.delete_tags"
    model = Tag
    success_url = reverse_lazy("blog:tags")

    def get(self, request, **kwargs):
        messages.error(request, 'Tag has been deleted successfully.')
        return self.delete(request, **kwargs)
