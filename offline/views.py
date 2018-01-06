from django.shortcuts import render
import datetime
from django.views.generic.edit import FormView
from offline.forms import LeadSyncFormSet
from offline.models import Lead

def customer_list(request):
    return render(request, 'offline/customer_list.html', {'version': datetime.datetime.today()})
    
def customer_uploaded_list(request):
    leads = Lead.objects.all().order_by('created_date')
    return render(request, 'offline/customer_uploaded_list.html', {'leads': leads})    

class AddView(FormView):
    template_name = 'offline/customer_sync.html'
    form_class = LeadSyncFormSet
    success_url = './customer_uploaded_list'
 
    def form_valid(self, form):
        form.save()
        return super().form_valid(form)