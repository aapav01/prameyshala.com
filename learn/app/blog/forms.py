from django import forms
from django.forms import ModelForm, inlineformset_factory
from .models import Tag, Post
from app.accounts.models import User


class PostForm(ModelForm):
    template_name = "posts/form_snippet.html"

    class Meta:
        model = Post
        fields = "__all__"
        exclude = ['slug']


class TagForm(ModelForm):
    class Meta:
        model = Tag
        fields = "__all__"
        exclude = ['slug']
