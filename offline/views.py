from django.shortcuts import render

def customer_list(request):
    #customers = Customer.objects.all().order_by('id')
    #return render(request, 'offline/customer_list.html', {'customers': customers})
    return render(request, 'offline/customer_list.html', {})