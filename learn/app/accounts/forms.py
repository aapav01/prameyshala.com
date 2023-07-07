from django import forms

class UserLoginForm(forms.Form):
    email = forms.CharField(max_length=50)
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'input'}))
