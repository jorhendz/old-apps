import sys
from pprint import pprint
from collections import Counter, defaultdict
from datetime import timedelta
import re
import time

from django.db.models import Q
from django.db.models import QuerySet
import pandas as pd

from providers.models import Municipality, Provider
from analytics.models import AnalyticsEvent, PageViewEvent
from analytics.scripts.muni_report import MunicipalityReport


def make_assertions():
    for m in Municipality.objects.all():
        print(m.name)
        report = MunicipalityReport(m)
        if report.no_events:
            # print("no events for ", m.name)
            continue

        t0 = time.time()
        chunks = report.create_chunks()
        t1 = time.time()
        dt = t1 - t0
        print(dt, sys.getsizeof(chunks))
        for key, chunk in chunks.items():
            if key == 'GENERAL':
                continue
            for tuple in chunk:
                assert type(tuple[0]) == str, f'{tuple[0]}, {type(tuple[0])}'
                assert type(tuple[1]) in [
                    int,
                    Counter,
                    str,
                ], f'{tuple[1]}, {type(tuple[1])}'


def mock_df_pageviews(m: Municipality):
    columns = ['path', 'pageviews']
    report = MunicipalityReport(m)
    chunks = report.create_chunks()
    from pprint import pprint

    pprint(chunks)
    df = pd.DataFrame(chunks['PAGEVIEWS']['Page paths'])
    print(df)
    return df


def to_df_pageviews(m: Municipality) -> pd.DataFrame:
    chunks = MunicipalityReport(m).create_chunks()

    path_counts = dict(chunks['PAGEVIEWS'][1][1])
    df = pd.DataFrame(path_counts.items(), columns=['path', m.name])
    return df


def most_visited_pages(q=None) -> pd.DataFrame:
    pageviews = PageViewEvent.objects.filter(q) if q else PageViewEvent.objects.all()
    paths = [pv.page_path for pv in pageviews]
    counter = Counter(paths)
    df = pd.DataFrame(counter.items(), columns=['path', 'count'])
    return df


def most_visited_providers(q=None):
    df = most_visited_pages()
    new_df = df[df['path'].str.contains("/provider/")]
    sorted_df = new_df.sort_values(by=['count'], ascending=False)

    paths = list(sorted_df['path'])
    names = []
    for path in paths:
        try:
            number = re.findall('\d+', path)[0]
            try:
                name = Provider.objects.get(pk=int(number)).name[:30]
            except Provider.DoesNotExist:
                name = None
            names.append(name)
        except Exception:
            names.append(None)

    print(len(paths))
    print(len(names))

    sorted_df['name'] = names

    return sorted_df


def muni_events_df() -> pd.DataFrame:
    muni_names = Municipality.objects.all().values_list('name', flat=True)
    m_event_counts = defaultdict(int)
    for m_name in muni_names:
        event_count = AnalyticsEvent.objects.filter(user_organization=m_name).count()
        m_event_counts[m_name] += event_count

    df = pd.DataFrame(m_event_counts.items(), columns=['municipality', 'event_count'])

    # Convert strings to ints
    df['event_count'] = df['event_count'].astype(int)

    return df.sort_values(by=['event_count'], ascending=False)


def has_numbers(s: str):
    return any(char.isdigit() for char in s)


m = Municipality.objects.get(name='Sønderborg')
m_events = muni_events_df()
# more options can be specified also
with pd.option_context('display.max_rows', None, 'display.max_columns', None):
    print(m_events)
# m_events.to_pickle('analytics/muni_events.pkl')
"""
from analytics.scripts.to_dataframe import *
"""
