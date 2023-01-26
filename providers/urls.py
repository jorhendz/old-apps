"""boernebasen URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from providers.models.creditation import Creditation
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from rest_framework import routers
from .api import (
    ProviderViewSet,
    CreditationViewSet,
    ThemeViewSet,
    LanguageViewSet,
    RegionViewSet,
    ServiceCategoryViewSet,
    PostalCodeViewSet,
    AreaViewSet,
    ServiceViewSet,
)
from django.shortcuts import redirect

import providers.api as api
from . import views
from .forms import CustomAuthForm

router = routers.DefaultRouter()
router.register(r'providers', ProviderViewSet)
router.register(r'themes', ThemeViewSet)
router.register(r'languages', LanguageViewSet)
router.register(r'regions', RegionViewSet)
router.register(r'service-categories', ServiceCategoryViewSet)
router.register(r'services', ServiceViewSet, basename="services")
router.register(r'postal-codes', PostalCodeViewSet)
router.register(r'areas', AreaViewSet)
router.register(r'creditations', CreditationViewSet)

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    # path('login/',
    #     auth_views.LoginView.as_view(
    #         template_name="login.html", authentication_form=CustomAuthForm),
    #     name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='index'), name='logout'),
    path(
        'accounts/password_change/',
        auth_views.PasswordChangeView.as_view(),
        name='password_change',
    ),
    path(
        'accounts/password_change/done/',
        auth_views.PasswordChangeDoneView.as_view(),
        name='password_change_done',
    ),
    path(
        'accounts/password_reset/',
        auth_views.PasswordResetView.as_view(template_name='password_reset.html'),
        name='password_reset',
    ),
    path(
        'accounts/password_reset/done',
        auth_views.PasswordResetDoneView.as_view(
            template_name='password_reset_done.html'
        ),
        name='password_reset_done',
    ),
    path(
        'accounts/reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(
            template_name='password_reset_confirm.html'
        ),
        name='password_reset_confirm',
    ),
    # path('accounts/reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_complete'),
    path(
        'accounts/reset/done',
        lambda r: redirect("login"),
        name='password_reset_complete',
    ),
    path("provider/<int:provider_id>/", views.provider),
    path('profile/', views.profile, name='profile'),
    path('signup/', views.social_worker_signup, name='signup'),
    path(
        'professional/signup/',
        views.professional_subscriber_signup,
        name='professional-subscriber-signup',
    ),
    path('provider/signup/', views.provider_signup, name='provider-signup'),
    path('search/', views.search, name="search"),
    path('work_methods/', views.work_methods, name="work_methods"),
    path('shared_knowledge/', views.shared_knowledge, name="shared_knowledge"),
    path('api/set_services', api.set_services),
    path('api/', include(router.urls)),
    path('api/api-auth/', include('rest_framework.urls', namespace='api')),
    path('profile/admin', views.profile_admin, name="profile_admin"),
    path('profile/contact', views.profile_contact, name="profile_contact"),
    path('profile/about', views.profile_about, name="profile_about"),
    path('profile/basis', views.profile_basis, name="profile_basis"),
    path('profile/services', views.profile_services, name="profile_services"),
    path('profile/toolbox', views.profile_toolbox, name="profile_toolbox"),
    path(
        'profile/postal_codes', views.profile_postal_codes, name="profile_postal_codes"
    ),
    path('legislation', views.legislation, name="legislation"),
    path('help/', views.help, name="help"),
]
