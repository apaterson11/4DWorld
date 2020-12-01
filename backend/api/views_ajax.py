""" This file contains AJAX request endpoints """
import json
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def check_email(request):
    email = json.loads(request.body).get('email')
    exists = User.objects.filter(email=email).exists()
    return JsonResponse({'exists': exists})
