from collections import defaultdict
import json
from pprint import pformat
from django.http import HttpResponse
from django.shortcuts import render

from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework import permissions
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from analytics.user_sessions import UserSessions, UserSessionsDTO
from analytics.utils import (
    find_search_success_proof,
    find_latest_search_event,
    num_successful_searches,
)
from analytics.scripts.muni_report import MunicipalityReport

from .models import (
    AnalyticsEvent,
    LoginEvent,
    PageViewEvent,
    RegisterEvent,
    SearchEvent,
)
from .api import (
    AnalyticsEventSerializer,
    LoginEventSerializer,
    PageViewEventSerializer,
    RegisterEventSerializer,
    SearchEventSerializer,
)
from accounts.models import CustomUser
from providers.models import Municipality


def country_map(request):
    """municipality_names = Municipality.objects.all().values_list('name', flat=True)
    m_event_counts = defaultdict(int)
    for m_name in municipality_names:
        event_count = AnalyticsEvent.objects.filter(user_organization=m_name).count()
        m_event_counts[m_name] += event_count"""

    """ with open('analytics/municipalities.geojson', 'r') as f:
        geodata = json.loads(f.read())
    for i in geodata['features']:
        muni_name = i['properties']['KOMNAVN']
        print(i['properties']) """

    return render(request, 'analytics_denmark.html')


class AnalyticsEventList(generics.ListCreateAPIView):
    queryset = AnalyticsEvent.objects.all()
    serializer_class = AnalyticsEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class AnalyticsEventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AnalyticsEvent.objects.all()
    serializer_class = AnalyticsEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class LoginEventList(generics.ListCreateAPIView):
    queryset = LoginEvent.objects.all()
    serializer_class = LoginEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class LoginEventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = LoginEvent.objects.all()
    serializer_class = LoginEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class LoginEventListUser(APIView):

    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk, format=None):
        """Return a list of LoginEvents for this user"""
        events = LoginEvent.objects.filter(base_event__user_id=pk)
        serializer = LoginEventSerializer(events, many=True)
        return Response(serializer.data)


class LoginEventListOrganization(APIView):

    permission_classes = [permissions.IsAdminUser]

    def get(self, request, org_name, format=None):
        login_events = LoginEvent.objects.filter(base_event__user_organization=org_name)
        print(login_events)
        serializer = LoginEventSerializer(login_events, many=True)
        return Response(serializer.data)


class RegisterEventList(generics.ListCreateAPIView):
    queryset = RegisterEvent.objects.all()
    serializer_class = RegisterEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class RegisterEventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RegisterEvent.objects.all()
    serializer_class = RegisterEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class PageViewEventList(generics.ListCreateAPIView):
    queryset = PageViewEvent.objects.all()
    serializer_class = PageViewEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class PageViewEventListUser(APIView):

    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk, format=None):
        """Return a list of PageViewEvents for this user"""
        events = PageViewEvent.objects.filter(base_event__user_id=pk)
        serializer = PageViewEventSerializer(events, many=True)
        return Response(serializer.data)


class PageViewEventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PageViewEvent.objects.all()
    serializer_class = PageViewEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class SearchEventList(generics.ListCreateAPIView):
    queryset = SearchEvent.objects.all()
    serializer_class = SearchEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class SearchEventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SearchEvent.objects.all()
    serializer_class = SearchEventSerializer
    permission_classes = [permissions.IsAdminUser]
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


# Sessions


class SessionsListUser(APIView):

    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk, format=None):
        user = CustomUser.objects.get(pk=pk)
        print(user)
        user_sessions = UserSessions(user)
        # response = user_sessions.serialize().data
        response = UserSessionsDTO(user_sessions).to_dict()

        return Response(response)


# Miscellanious overviews


class LoggedInOrganizations(APIView):

    permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        login_events = LoginEvent.objects.all()
        organizations = {}
        for event in login_events:
            try:
                organizations[event.base_event.user_organization] += 1
            except KeyError as e:
                key = e.args[0]
                organizations[key] = 0

        return Response(organizations)


class UserStatsDetail(APIView):

    permission_classes = [permissions.IsAdminUser]

    def get(self, request, pk, format=None):
        user = CustomUser.objects.get(pk=pk)
        event = SearchEventSerializer(find_latest_search_event(user)).data
        response = {
            'id': user.id,
            'successful_searches': num_successful_searches(user),
            'latest_search_test': event,
            'proof': find_search_success_proof(user),
        }
        return Response(response)
