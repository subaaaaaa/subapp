from django.conf.urls import include, url
from . import views
from django.views.generic import TemplateView
from offline.views import SyncLeadView, ServiceWorkerView

urlpatterns = [
    url(r'^$', views.customer_list, name='offline/customer_list'),
    url(r'^customer_uploaded_list$', views.customer_uploaded_list, name='offline/customer_uploaded_list'),
    url(r'^customer_sync$', SyncLeadView.as_view(), name='offline/customer_sync'),
    url(r'^sw.js', ServiceWorkerView.as_view(), name='sw.js'),
]