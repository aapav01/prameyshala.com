from django import forms
from django.forms import ModelForm
from .models import Enrollment, Role, User, ReferralDetails
from django.contrib.auth.models import Permission, Group


class UserLoginForm(forms.Form):
    phone_number = forms.CharField(max_length=50, widget=forms.TextInput(attrs={
        'class': 'input input-bordered mt-2 mb-4', 'type': 'tel', 'placeholder': 'Phone Number'}),
        label='Phone Number'
    )
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={'class': 'input input-bordered mt-2', 'placeholder': 'Password'}))


class UserRegisterForm(forms.Form):
    full_name = forms.CharField(max_length=50, widget=forms.TextInput(
        attrs={'placeholder': 'Full Name'}), label='Full Name')
    phone_number = forms.CharField(max_length=50, widget=forms.TextInput(attrs={'type': 'tel', 'placeholder': 'Phone Number'}),
                                   label='Phone Number'
                                   )
    email = forms.EmailField(widget=forms.EmailInput(
        attrs={'placeholder': 'me@example.com'}))
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={'placeholder': 'Password'}))
    confirm_password = forms.CharField(widget=forms.PasswordInput(
        attrs={'placeholder': 'Password'}), label='Confirm Password')


class EnrollmentForm(ModelForm):
    class Meta:
        model = Enrollment
        fields = "__all__"
        exclude = ['expiration_date']


class RolesForm(ModelForm):
    class Meta:
        model = Role
        fields = "__all__"


class UsersForm(ModelForm):
    class Meta:
        model = User
        fields = ['full_name', 'password', 'phone_number', 'email', 'is_active', 'country', 'state', 'city',
                  'is_superuser', 'is_staff',   'groups', 'user_permissions',  'referred_by']
        exclude = ['last_login']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields['password'].widget = forms.HiddenInput()

class UserProfile(ModelForm):
    class Meta:
        model = User
        fields = ['full_name', 'phone_number', 'email', 'country', 'state', 'city', 'photo']
        exclude = ['last_login', 'password', 'is_active', 'is_superuser', 'is_staff', 'groups', 'user_permissions',]

class ReferralsForm(ModelForm):

    class Meta:
        model = ReferralDetails
        fields = "__all__"
        exclude = ["referral_id"]

