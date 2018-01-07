from django.shortcuts import render
import datetime
from django.views.generic.edit import FormView
from offline.forms import LeadSyncFormSet
from offline.models import Lead
from django.contrib import messages  # メッセージフレームワーク


def customer_list(request):
    return render(request, 'offline/customer_list.html', {})
    
def customer_uploaded_list(request):
    leads = Lead.objects.all().order_by('created_date')
    return render(request, 'offline/customer_uploaded_list.html', {'leads': leads})    

class AddView(FormView):
    template_name = 'offline/customer_sync.html'
    form_class = LeadSyncFormSet
    success_url = './customer_uploaded_list'
 
    def form_valid(self, form):
        form.save()
        ''' バリデーションを通った時 '''
        messages.success(self.request, "保存しました")
        return super().form_valid(form)
        
    def form_invalid(self, form):
        ''' バリデーションに失敗した時 '''
        messages.warning(self.request, "保存できませんでした")
        return super().form_invalid(form)
