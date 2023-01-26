from collections import Counter

from django.db.models.query import QuerySet
from datetime import datetime, timedelta
from django.db import models
from django.db.models import Q

from accounts.models import CustomUser
from analytics.api import PageViewEventSerializer, SearchEventSerializer
from analytics import timestamps
from providers.models.social_worker import SocialWorker, Municipality
from .models import AnalyticsEvent, PageViewEvent, SearchEvent

# Think of this module as Django ORM practice


def flatten(lst: list):
    new_list = []
    for i in lst:
        for j in i:
            new_list.append(j)
    return new_list


def get_latest_event_for_user(user: CustomUser):
    try:
        return AnalyticsEvent.objects.filter(user_id=user.id).latest('timestamp')
    except AnalyticsEvent.DoesNotExist:
        return None


def is_null_search(search: SearchEvent) -> bool:
    """Returns True if the search didn't have any parameters"""
    try:
        return all(
            [
                search.freetext == None,
                search.service_category == None,
                search.gender == None,
                search.is_volunteer_organization == None,
                len(search.postal_codes.all()) == 0,
                len(search.themes.all()) == 0,
                len(search.languages.all()) == 0,
                len(search.creditations.all()) == 0,
            ]
        )
    except AttributeError:
        print("attribute error", search.id)


def count_search_params(search: SearchEvent) -> dict:
    return {
        'freetext': 0 if search.freetext == None else 1,
        'service_category': 0 if search.service_category == None else 1,
        'gender': 0 if search.gender == None else 1,
        'is_volunteer_organization': 0
        if search.is_volunteer_organization == None
        else 1,
        'postal_codes': 0 if len(search.postal_codes.all()) == 0 else 1,
        'themes': 0 if len(search.themes.all()) == 0 else 1,
        'languages': 0 if len(search.languages.all()) == 0 else 1,
        'creditations': 0 if len(search.creditations.all()) == 0 else 1,
    }


def count_search_params_list(searches: list[SearchEvent]) -> Counter:
    total = Counter()
    counted = [count_search_params(s) for s in searches]
    for c in counted:
        total += Counter(c)
    return total


def find_latest_search_event(user: CustomUser) -> SearchEvent:
    latest_base_event = get_latest_event_for_user(user)
    if not latest_base_event:
        print("find_latest_search_event(): no latest_base_event")
        return None

    base_event = latest_base_event
    while True:
        try:
            prev = base_event.get_previous_by_timestamp()
            prev_event = prev.get_parent()
            event = base_event.get_parent()

            if isinstance(prev_event, SearchEvent) and isinstance(event, PageViewEvent):
                return prev_event

            base_event = prev
        except AnalyticsEvent.DoesNotExist:
            break


def find_search_success_proof(user: CustomUser):
    latest_base_event = get_latest_event_for_user(user)
    if not latest_base_event:
        print("find_search_success_proof() no latest_base_event")
        return None

    proof_pairs = []

    base_event = latest_base_event
    while True:
        try:
            prev = base_event.get_previous_by_timestamp()
            prev_event = prev.get_parent()
            event = base_event.get_parent()

            if isinstance(prev_event, SearchEvent) and isinstance(event, PageViewEvent):
                print("Found a pair")
                r_search = SearchEventSerializer(prev_event).data
                r_pageview = PageViewEventSerializer(event).data

                pair = {
                    'search_event': r_search,
                    'search_ts': prev_event.base_event.timestamp,
                    'pageview_event': r_pageview,
                }
                proof_pairs.append(pair)

            base_event = prev
        except AnalyticsEvent.DoesNotExist:
            break

    return proof_pairs


def get_user_events(user: CustomUser):
    return AnalyticsEvent.objects.filter(user_id=user.id)


def find_successful_searches(user: CustomUser):
    """A 'successful search' is a search event succeeded by
    a pageview event on a provider page.
    Find all successful searches for a user"""
    successful_searches = []

    latest_base_event = get_latest_event_for_user(user)
    if not latest_base_event:
        return None

    base_event = latest_base_event
    while True:
        try:
            prev = base_event.get_previous_by_timestamp()
            print(base_event, prev)

            prev_event = prev.get_parent()
            event = base_event.get_parent()

            if (
                isinstance(prev_event, SearchEvent)
                and isinstance(event, PageViewEvent)
                and 'provider/' in event.page_path
            ):

                successful_searches.append(prev_event)
            base_event = prev
        except AnalyticsEvent.DoesNotExist:
            break

    return successful_searches


def num_successful_searches(user: CustomUser):
    successful = find_successful_searches(user)
    if successful:
        return len(find_successful_searches(user))
    return 0


def successful_searches_proof(successful_searches: list):
    if not successful_searches:
        print("No successful searches to prove")
        return None


def model_name(instance: models.Model) -> str:
    return instance._meta.model.__name__


def events_30_days():
    now = timestamps.get_now()
    then = now - timedelta(days=30)
    return events_in_timeframe(then, now)


def events_for_month(month: int) -> list[AnalyticsEvent]:
    return events_in_timeframe(
        timestamps.get_datetime(2022, month, 1),
        timestamps.get_datetime(2022, month + 1, 1),
    )


def events_in_timeframe(t0: datetime, t1: datetime) -> list[AnalyticsEvent]:
    return AnalyticsEvent.objects.filter(timestamp__range=(t0, t1))


def events_3_months():
    return {
        'April': events_for_month(4),
        'May': events_for_month(5),
        'June': events_for_month(6),
    }


def events_for_user(user: CustomUser, q: Q = None) -> list[QuerySet]:
    q_user = Q(user_id=user.id)
    if q is None:
        return AnalyticsEvent.objects.filter(q_user)
    query = q_user & q
    return AnalyticsEvent.objects.filter(query)


def events_for_municipality(municipality, q: Q = None) -> list[QuerySet]:
    soc_workers = SocialWorker.objects.filter(municipality=municipality)
    querysets = []
    for soc_worker in soc_workers:
        querysets.append(events_for_user(soc_worker.user, q))
    return list(filter(None, querysets))


sønderborg = Municipality.objects.get(name='Sønderborg')


def worker_events_range(
    m: Municipality, month_range: tuple[int, int] = (4, 7)
) -> list[QuerySet]:
    """Returns the events from months [int; int[ as a list of
    querysets from each social worker in the municipality m."""
    events = events_for_municipality(
        municipality=m,
        q=Q(
            timestamp__range=(
                timestamps.get_datetime(year=2022, month=month_range[0], day=1),
                timestamps.get_datetime(year=2022, month=month_range[1], day=1),
            )
        ),
    )
    return events


def worker_events_range_count(
    m: Municipality, month_range: tuple[int, int] = (4, 7)
) -> int:
    """Returns the number of events from months [int; int["""
    soc_workers = SocialWorker.objects.filter(municipality=m)
    ids = soc_workers.values_list('user_id', flat=True)
    count = 0
    for id in ids:
        count += AnalyticsEvent.objects.filter(
            Q(user_id=id)
            & Q(
                timestamp__range=(
                    timestamps.get_datetime(year=2022, month=month_range[0], day=1),
                    timestamps.get_datetime(year=2022, month=month_range[1], day=1),
                )
            )
        ).count()
    return count


"""
from analytics.utils import *
"""
