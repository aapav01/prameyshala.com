from django.shortcuts import render,redirect
from django.views import View
from ..models import Classes
from ..forms import *;
# Create your views here.
class ClassesView(View):
    
    model = Classes
    template_name = 'classes/index.html'
    form = ClassesForm
    def get(self,request):
        classes = self.model.objects.all()
        context = {'classes':classes}
        return render(request,self.template_name,context)
    
    def post(self,request,*args):
        form = form(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            description = form.cleaned_data['description']
            image = form.cleaned_data['image']
            slug = form.cleaned_data['slug']
            position = form.cleaned_data['position']
            publish_at = form.cleaned_data['publish_at']
            classes = self.model(name,description,image,slug,position,publish_at)
            classes.save()
            return redirect('classes')
        return render(request,self.template_name,{"form":form})
    
    def patch(self,request):
        pass

    def delete(self,request):
        pass
    
    



