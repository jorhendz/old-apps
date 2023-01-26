from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views


urlpatterns = [
    path('country_map/', views.country_map, name='country-map'),
    path('events/', views.AnalyticsEventList.as_view(), name='event-list'),
    path('events/<int:pk>/', views.AnalyticsEventDetail.as_view(), name='event-detail'),
    path('events/login/', views.LoginEventList.as_view(), name='login-event-list'),
    path(
        'events/login/<int:pk>/',
        views.LoginEventDetail.as_view(),
        name='login-event-detail',
    ),
    path(
        'events/user/<int:pk>/login/',
        views.LoginEventListUser.as_view(),
        name='login-event-list-user',
    ),
    path('events/login/org/', views.LoggedInOrganizations.as_view()),
    path(
        'events/login/org/<str:org_name>/', views.LoginEventListOrganization.as_view()
    ),
    path(
        'events/register/',
        views.RegisterEventList.as_view(),
        name='register-event-list',
    ),
    path(
        'events/user/<int:pk>/register/',
        views.RegisterEventDetail.as_view(),
        name='register-event-detail',
    ),
    path(
        'events/pageview/',
        views.PageViewEventList.as_view(),
        name='pageview-event-list',
    ),
    path(
        'events/pageview/<int:pk>/',
        views.PageViewEventDetail.as_view(),
        name='pageview-event-detail',
    ),
    path(
        'events/user/<int:pk>/pageview/',
        views.PageViewEventListUser.as_view(),
        name='pageview-event-list-user',
    ),
    path('events/search/', views.SearchEventList.as_view()),
    path('user/<int:pk>/sessioninfo/', views.SessionsListUser.as_view()),
    path('user/<int:pk>/stats/', views.UserStatsDetail.as_view()),
    path('api-auth/', include('rest_framework.urls')),
]

urlpatterns = format_suffix_patterns(urlpatterns)
