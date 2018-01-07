from django import forms
from .models import Lead
 
class LeadSyncForm(forms.ModelForm):
 
    class Meta:
        model = Lead
        #fields = '__all__'
        fields = ('lno', 'jname', 'kname', 'tel', 'postal', 'address1', 'address2', 'address3')
        widgets = {
            'lno': forms.TextInput(attrs={'class': 'form-control'}),
            'jname': forms.TextInput(attrs={'class': 'form-control'}),
            'kname': forms.TextInput(attrs={'class': 'form-control'}),
            'tel': forms.TextInput(attrs={'class': 'form-control'}),
            'postal': forms.TextInput(attrs={'class': 'form-control'}),
            'address1': forms.TextInput(attrs={'class': 'form-control'}),
            'address2': forms.TextInput(attrs={'class': 'form-control'}),
            'address3': forms.TextInput(attrs={'class': 'form-control'}),
        } 
# ここが追加!!
LeadFormSet = forms.modelformset_factory(Lead, form=LeadSyncForm, extra=100, can_delete=True)

class LeadSyncFormSet(LeadFormSet):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.queryset = Lead.objects.none()