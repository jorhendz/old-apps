from django.urls import path
from sso import views

urlpatterns = [
    path("signin", views.sign_in, name="signin"),
    path("callback", views.callback, name="callback"),
]
