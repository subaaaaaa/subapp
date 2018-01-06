from django.conf.urls import include, url
from . import views
from django.views.generic import TemplateView
from offline.views import AddView

urlpatterns = [
    url(r'^$', views.customer_list, name='offline/customer_list'),
    url(r'^customer_uploaded_list$', views.customer_uploaded_list, name='offline/customer_uploaded_list'),
    url(r'^customer_sync$', AddView.as_view(), name='offline/customer_sync'),
    url(r'^sw.js', (TemplateView.as_view(template_name="sw.js", content_type='application/javascript', )), name='sw.js'),
]