from django import forms

class ClassesForm(forms.Form):
    name = forms.CharField(max_length=255,
    widget = forms.TextInput(attrs={
        'class':'djanog-custom-forms input',
        'type': 'text', 'placeholder': 'Name'}),
        label='Name'
    )
    description = forms.CharField(widget = forms.Textarea(attrs={
        'class':'djanog-custom-forms input',
        'type': 'text', 'placeholder': 'Description'}),
        label='Description'
    )
    image = forms.CharField(max_length=255,
    widget = forms.TextInput(attrs={
        'class':'djanog-custom-forms input',
        'type': 'image', 'placeholder': 'Image'}),
        label='Image'
    )
    position = forms.IntegerField(widget = forms.TextInput(attrs={
        'class':'djanog-custom-forms input',
        'type': 'text', 'placeholder': 'Position'}),
        label='Position'
    )