from django.db import models
from django.utils import timezone

class Lead(models.Model):
    lno = models.CharField(max_length=20)
    jname = models.CharField(max_length=50)
    tel = models.CharField(max_length=20)
    postal = models.CharField(max_length=15)
    address1 = models.CharField(max_length=100)
    address2 = models.CharField(max_length=100, null=True)
    address3 = models.CharField(max_length=100, null=True)
    created_date = models.DateTimeField(default=timezone.now)
