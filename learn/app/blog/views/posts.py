from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from django.db.models import Count
from ..models import Post
from ..forms import PostForm
from django.db.models import Q


class PostsView(PermissionRequiredMixin, ListView):
    permission_required = "blog.view_posts"
    model = Post
    template_name = "posts/index.html"
    form = PostForm
    context_object_name = "posts"
    extra_context = {
        'title': 'Posts',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Blog'}, {'label': 'Posts'}],
        'form': form
    }
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = PostForm(instance=obj, prefix=obj.pk)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.slug = slugify(instance.title)
            instance.save()
            tags = form.cleaned_data['tags']
            instance.tags.set(tags)
            messages.success(
                request, f'{instance.title} has been created successfully.')
            self.extra_context.update({'form': PostForm})
            return redirect('blog:posts')
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(subtitle__icontains=search_query)
            )

        return queryset


class PostsUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "blog.change_posts"
    model = Post
    form_class = PostForm
    success_url = reverse_lazy("blog:posts")
    template_name = "form.html"

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        prefix = self.kwargs.get('pk')
        kwargs['prefix'] = prefix
        return kwargs

    def form_valid(self, form):
        form.instance.slug = slugify(form.instance.title)
        messages.info(
            self.request, f'{form.instance.title} has been updated successfully.')
        return super().form_valid(form)


class PostsDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "blog.delete_posts"
    model = Post
    success_url = reverse_lazy("blog:posts")

    def get(self, request, **kwargs):
        messages.error(request, 'Post has been deleted successfully.')
        return self.delete(request, **kwargs)
