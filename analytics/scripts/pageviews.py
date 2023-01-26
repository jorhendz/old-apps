from collections import Counter
from datetime import timedelta
from pprint import pprint
import re
from analytics.utils import worker_events_range, flatten
from analytics.models import PageViewEvent, AnalyticsEvent
from providers.models import Municipality, Provider


def how_many_soc_workers(events: list[AnalyticsEvent]):
    unique_workers = set()
    for event in events:
        unique_workers.add(event.user_id)
    print(unique_workers)
    return len(unique_workers)


def page_paths(month: list[AnalyticsEvent]):
    paths = []
    for event in month:
        parent = event.get_parent()
        if type(parent) == PageViewEvent:
            paths.append(parent.page_path)
    return paths


"""
from analytics.scripts.pageviews import *
"""
