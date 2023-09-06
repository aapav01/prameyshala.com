from django.contrib.auth.decorators import login_required
from django.urls import path
from .views import *


app_name = 'blog'

urlpatterns =[
    path('posts/', login_required(PostsView.as_view()), name='posts'),
    path("posts/<int:pk>/update/",
         login_required(PostsUpdateView.as_view()), name="post-update"),
    path("posts/<int:pk>/delete/",
         login_required(PostsDeleteView.as_view()), name="post-delete"),
    path('tags/', login_required(TagsView.as_view()), name='tags'),
    path("tags/<int:pk>/update/",
         login_required(TagsUpdateView.as_view()), name="tag-update"),
    path("tags/<int:pk>/delete/",
         login_required(TagsDeleteView.as_view()), name="tag-delete"),
]
