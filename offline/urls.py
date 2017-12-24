from django.conf.urls import include, url
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^$', views.customer_list, name='offline/customer_list'),
    url(r'^sw.js', (TemplateView.as_view(template_name="sw.js", content_type='application/javascript', )), name='sw.js'),
    url(r'^page.js', (TemplateView.as_view(template_name="page.js", content_type='application/javascript', )), name='page.js'),
    url(r'^cache-polyfill.js', (TemplateView.as_view(template_name="cache-polyfill.js", content_type='application/javascript', )), name='cache-polyfill.js'),
]