from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from ..forms import UserProfile
from django.contrib import messages
from django.views.generic import TemplateView


User = get_user_model()


@login_required()
def home(request):
    title = 'Home'
    breadcrumbs = [{'url': 'core:home',
                    'label': 'Dashboard'}, {'label': 'Home'}]
    context = {'title': title, 'breadcrumbs': breadcrumbs}

    return render(request, 'accounts/home.html', context)


class UserProfile(TemplateView):
    template_name = 'accounts/users/profile.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = self.request.user.full_name
        context['breadcrumbs'] = [
            {'url': 'core:home', 'label': 'Dashboard'}, {'label': "User's Profile"}]
        context['form'] = UserProfile(instance=self.request.user)
        return context

    def post(self, request, **kwargs):
        form = UserProfile(request.POST, request.FILES,
                           instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('accounts:user_profile')
        else:
            messages.error(
                request, 'Failed to update profile. Please try again.')
            return redirect('accounts:user_profile')
