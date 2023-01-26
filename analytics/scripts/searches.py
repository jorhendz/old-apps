import os
import time
from collections import Counter, defaultdict
from pprint import pprint

from analytics.models import PageViewEvent, SearchEvent, AnalyticsEvent
from providers.models import Municipality, SocialWorker
from analytics.utils import (
    count_search_params_list,
    is_null_search,
)
from analytics import timestamps


# Successful searches - Searches followed by a provider pageview


def user_ids_for_muni(m: Municipality) -> list[int]:
    return SocialWorker.objects.filter(municipality=m).values_list('user_id', flat=True)


def events_in_period(start_date, end_date):
    return AnalyticsEvent.objects.filter(
        timestamp__range=(start_date, end_date)
    )


def events_by_user(user, start_date, end_date):
    return AnalyticsEvent.objects.filter(user_id=user.id).filter(
        timestamp__range=(start_date, end_date)
    )


def searches_in_period(start_date, end_date):
    return SearchEvent.objects.filter(
        base_event__timestamp__range=(start_date, end_date)
    )


def searches_muni(m: Municipality, start_date, end_date):
    user_ids = user_ids_for_muni(m)
    return SearchEvent.objects.filter(base_event__user_id__in=user_ids).filter(
        base_event__timestamp__range=(start_date, end_date)
    )


def successful_searches_in_period(start_date, end_date):
    base_events = events_in_period(start_date, end_date)
    if not base_events:
        return None

    successful = []
    prev = base_events[0]
    for event in base_events:
        curr_parent = event.get_parent()
        prev_parent = prev.get_parent()
        if type(curr_parent) == PageViewEvent and type(prev_parent) == SearchEvent:
            successful.append(prev_parent)
        prev = event
    return successful


def successful_searches(soc_worker, start_date, end_date):
    base_events = events_by_user(soc_worker.user, start_date, end_date)
    if not base_events:
        return None

    successful = []
    prev = base_events[0]
    for event in base_events:
        """print(event.user_id, timestamps.to_string(event.timestamp),
        event.id, event.get_parent().__class__.__name__)"""

        curr_parent = event.get_parent()
        prev_parent = prev.get_parent()

        if type(curr_parent) == PageViewEvent and type(prev_parent) == SearchEvent:
            successful.append(prev_parent)

        prev = event
    return successful


def successful_searches_muni(m: Municipality, start_date, end_date):
    soc_workers = SocialWorker.objects.filter(municipality=m)
    successful_querysets = []
    count = 0
    for soc_worker in soc_workers:
        successful = successful_searches(soc_worker, start_date, end_date)
        if successful:
            count += 1
            successful_querysets.extend(successful)
    return successful_querysets


# Searches report
start_date = timestamps.get_datetime(2022, 4, 1)
end_date = timestamps.get_datetime(2022, 12, 1)


def pad(tup: tuple, indent=0) -> str:
    width = 50
    return '{}{:{}s}{}\n'.format(indent * ' ', str(tup[0]), width - indent, str(tup[1]))


def _fmt_counter(c: Counter, n=None, indent=0):
    return ''.join([pad((k, v), indent=indent) for k, v in c.most_common(n)])


def _fmt_metric(metric, indent=0):
    if type(metric) in [int, float, bool, str]:
        return metric
    if type(metric) != Counter:
        raise ValueError('Metrics should be primitive types or Counters')
    # The metric is a Counter object
    return '\n' + _fmt_counter(metric, indent=indent)


def _fmt_line(dimension, metric, indent=0):
    return pad((dimension, _fmt_metric(metric, indent=indent + 4)), indent=indent)


def fmt_chunk(data: list[tuple], indent=0):
    return (
        ''.join(
            [_fmt_line(dimension, metric, indent=indent)
             for dimension, metric in data]
        )
        + '\n'
    )


def all_searches(start_date, end_date) -> list[tuple]:
    searches_ = searches_in_period(start_date, end_date)
    successful = successful_searches_in_period(start_date, end_date)
    null_searches = list(filter(is_null_search, successful))
    not_null = list(filter(lambda s: not is_null_search(s), successful))

    search_params = count_search_params_list(searches_)

    service_categories = searches_.values_list(
        'service_category', flat=True)
    freetexts = searches_.values_list('freetext', flat=True)
    themes = searches_.values_list('themes', flat=True)

    chunk = [
        ('Number of searches:', searches_.count()),
        ('Successful searches:', len(successful)),
        ('Null searches:', len(null_searches)),
        ('Not null searches:', len(not_null)),
        ('Search parameters used:', search_params),
        ('Service categories:', Counter(service_categories)),
        ('Freetexts searched for:', Counter(freetexts)),
        ('Themes searched for:', Counter(themes)),
    ]
    return chunk


def write_to_file(text: str, name: str):
    file_name = (
        name.replace('\'', '')
        .replace('\"', '')
        .replace('\`', '')
        .replace(' ', '_')
        .lower()
    )

    folder = os.path.join('.', 'reports')
    if not os.path.exists(folder):
        os.mkdir(folder)
    elif not os.path.isdir(folder):
        print(f'Creating the {folder} folder')
        return
    f = open(os.path.join(folder, file_name), 'w+')
    f.write(text)
    f.close()
    print(f'Wrote reports/{file_name}')


def write_searches(searches) -> None:
    content_text = fmt_chunk(searches, indent=4)

    file_name = f'searches.txt'
    write_to_file('S' + content_text, file_name)


def export_text(chunks: dict) -> None:
    content_text = ''.join(
        [
            f'{chunk_title}\n' + fmt_chunk(chunk, indent=4)
            for chunk_title, chunk in chunks.items()
        ]
    )

    file_name = f'searches.txt'
    write_to_file('Searches' + content_text, file_name)


def searches_report(start_date, end_date):
    searches_ = all_searches(start_date, end_date)
    chunks = {'SEARCHES': searches_}
    print(searches_)
    export_text(chunks)


# searches_report(start_date, end_date)
"""
from analytics.scripts.searches import *
"""
