from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_GET

User = get_user_model()

@require_GET
def check_username_availability(request):
    username = request.GET.get("username", "")
    exists = User.objects.filter(username__iexact=username).exists()
    return JsonResponse({"exists": exists})


def home(request):
    """
    Render the home page.
    """
    return render(request, 'home/home.html')