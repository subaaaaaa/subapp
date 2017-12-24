from django.conf.urls import include, url
from . import views

urlpatterns = [
    url(r'^$', views.customer_list, name='offline/customer_list'),
]