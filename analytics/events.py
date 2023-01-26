from django.contrib.auth.models import AnonymousUser

from analytics.user_properties import (
    get_user_organization,
)
from analytics.models import (
    AnalyticsEvent,
    LoginEvent,
    PageViewEvent,
    RegisterEvent,
    SearchEvent,
)
from providers.models import (
    get_user_type,
)


class EventNames:
    LOGIN = 'login'
    REGISTER = 'register'
    TEST = 'test'


class EventFactory:
    def __init__(self, user) -> None:
        self.user = user

    def save(self, event):
        event.save()

        if isinstance(self.user, AnonymousUser):
            # Not logged in
            return

        if isinstance(event, AnalyticsEvent):
            self.user.last_analytics_event = event.timestamp
            self.user.save()
        else:
            print(event.__class__.__name__)

    def _base_event(self):
        user = self.user
        if isinstance(user, AnonymousUser):
            event = AnalyticsEvent.not_logged_in()
            self.save(event)
            return event

        user_type = get_user_type(user)

        user_organization = get_user_organization(user)
        event = AnalyticsEvent(
            user_id=user.id,
            user_type=user_type,
            user_organization=user_organization,
        )
        self.save(event)
        return event

    def page_view(self, request):
        base_event = self._base_event()
        event = PageViewEvent(
            base_event=base_event,
            page_path=request.path,
        )
        self.save(event)

    def login(self):
        base_event = self._base_event()
        self.save(LoginEvent(base_event=base_event))

    def register(self):
        base_event = self._base_event()
        self.save(RegisterEvent(base_event=base_event))

    def search(self, query: dict):
        base_event = self._base_event()

        event = SearchEvent(
            base_event=base_event,
            freetext=query.get('freetext'),
            service_category=query.get('service_category'),
            is_volunteer_organization=query.get('is_volunteer_organization'),
            gender=query.get('gender'),
        )
        self.save(event)

        # Many to many relations
        postal_codes = query.get('postal_codes')
        themes = query.get('themes')
        languages = query.get('languages')
        creditations = query.get('creditations')
        if postal_codes:
            event.postal_codes.set(postal_codes)
        if themes:
            event.themes.set(themes)
        if languages:
            event.languages.set(languages)
        if creditations:
            event.creditations.set(creditations)
