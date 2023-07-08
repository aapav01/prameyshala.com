from django.shortcuts import render
from django.views import View
from .models  import Classes
# Create your views here.
def classes(request):
    classes = Classes.objects.all()
    context = {'classes':classes}
    return render(request,'classes/classes.html',context)
