from asyncio import base_events
from rest_framework import serializers

from .models import (
    AnalyticsEvent,
    LoginEvent,
    PageViewEvent,
    RegisterEvent,
    SearchEvent,
)


class AnalyticsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsEvent
        fields = '__all__'


class LoginEventSerializer(serializers.ModelSerializer):

    base_event = AnalyticsEventSerializer(read_only=True)

    class Meta:
        model = LoginEvent
        fields = '__all__'


class RegisterEventSerializer(serializers.ModelSerializer):

    base_event = AnalyticsEventSerializer(read_only=True)

    class Meta:
        model = RegisterEvent
        fields = '__all__'


class PageViewEventSerializer(serializers.ModelSerializer):

    base_event = AnalyticsEventSerializer(read_only=True)

    class Meta:
        model = PageViewEvent
        fields = '__all__'


class SearchEventSerializer(serializers.ModelSerializer):

    base_events = AnalyticsEventSerializer(read_only=True)

    class Meta:
        model = SearchEvent
        fields = '__all__'
