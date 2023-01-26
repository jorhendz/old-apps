import json
import os.path
import os
from collections import Counter, defaultdict
import time
import datetime

from django.db.models.query import QuerySet
from analytics import timestamps
from tqdm import tqdm

from analytics.models import AnalyticsEvent, PageViewEvent
from analytics.scripts.report import Report, pad
from analytics.scripts.searches import searches_muni, successful_searches_muni
from analytics.scripts.sessions import avg_session_length_muni, num_sessions_muni
from analytics.utils import (
    count_search_params_list,
    is_null_search,
    worker_events_range_count,
)
from providers.models import Municipality, SocialWorker


from pprint import pprint


class MunicipalityReport(Report):
    def __init__(
        self,
        municipality: Municipality,
        start_date: datetime.datetime,
        end_date: datetime.datetime,
    ) -> None:

        if not AnalyticsEvent.objects.filter(user_organization=municipality.name):
            self.no_events = True
            return
        self.m = municipality
        self.no_events = False
        self.start_date = start_date
        self.end_date = end_date
        self.chunks = self.create_chunks()

    def create_chunks(self) -> dict[str, list[tuple]]:
        """Creates a dictionary of chunks (lists of data as tuples)
        with the keys being the different topics"""
        if self.no_events:
            return None
        return {
            'GENERAL': self._general_info(),
            'EVENTS': self._events_count(),
            'PAGEVIEWS': self._pageviews(),
            'SEARCHES': self._searches(),
            'SESSIONS': self._sessions(),
        }

    def export_text(self) -> None:
        content_text = ''.join(
            [
                f'{chunk_title}\n' + fmt_chunk(chunk, indent=4)
                for chunk_title, chunk in self.chunks.items()
            ]
        )

        file_name = f'{self.m}.txt'
        write_to_file(self._title() + content_text, file_name)

    def export_json(self) -> str:
        file_name = f'reports/{self.m}.json'
        with open(file_name, 'w') as f:
            json.dump(dsToDict(self.chunks), f, indent=4)
        print(f'Wrote {file_name}')

    def _title(self) -> str:
        return f'************ANALYTICS REPORT FOR {self.m.name.upper()}************\n\n'

    def _general_info(self) -> list[tuple]:
        social_workers = SocialWorker.objects.filter(municipality=self.m)
        chunk = [('Social workers', len(social_workers))]
        return chunk

    def event_count_spring(self) -> list[tuple]:
        apr, may, jun = self._spring_events_count()
        chunk = [
            ('April', apr),
            ('May', may),
            ('June', jun),
        ]
        return chunk

    def _pageviews(self) -> str:
        p_paths = self._page_paths()

        chunk = [
            ('Number of page paths:', len(p_paths)),
            ('Page paths', Counter(p_paths)),
        ]
        return chunk

    def _page_paths(self) -> Counter:
        page_paths = (
            PageViewEvent.objects.filter(
                base_event__user_organization='Sønderborg')
            .filter(base_event__timestamp__range=(self.start_date, self.end_date))
            .values_list('page_path', flat=True)
        )
        return page_paths

    def _sessions(self) -> list[tuple]:
        num_sessions = num_sessions_muni(
            self.m, self.start_date, self.end_date)
        avg_session_len = avg_session_length_muni(
            self.m, self.start_date, self.end_date
        )

        chunk = [
            ('Number of sessions:', num_sessions),
            ('Avg. session length', str(avg_session_len)),
        ]
        return chunk

    def _searches(self) -> list[tuple]:
        _searches_muni = searches_muni(self.m, self.start_date, self.end_date)
        successful = successful_searches_muni(
            self.m, self.start_date, self.end_date)
        null_searches = list(filter(is_null_search, successful))
        not_null = list(filter(lambda s: not is_null_search(s), successful))

        search_params = count_search_params_list(_searches_muni)

        service_categories = _searches_muni.values_list(
            'service_category', flat=True)
        freetexts = _searches_muni.values_list('freetext', flat=True)
        themes = _searches_muni.values_list('themes', flat=True)

        chunk = [
            ('Number of searches:', _searches_muni.count()),
            ('Successful searches:', len(successful)),
            ('Null searches:', len(null_searches)),
            ('Not null searches:', len(not_null)),
            ('Search parameters used:', search_params),
            ('Service categories:', Counter(service_categories)),
            ('Freetexts searched for:', Counter(freetexts)),
            ('Themes searched for:', Counter(themes)),
        ]

        return chunk

    def count_service_categories(searches: QuerySet):
        service_categories = searches.values_list(
            'service_category', flat=True)

    def _spring_events_count(self) -> tuple[int, ...]:
        apr = worker_events_range_count(self.m, month_range=(4, 5))
        may = worker_events_range_count(self.m, month_range=(5, 6))
        jun = worker_events_range_count(self.m, month_range=(6, 7))
        return apr, may, jun

    def _events_count(self):
        return [
            (
                'events',
                worker_events_range_count(
                    self.m, month_range=(
                        self.start_date.month, self.end_date.month)
                ),
            )
        ]


def _fmt_line(dimension, metric, indent=0):
    return pad((dimension, _fmt_metric(metric, indent=indent + 4)), indent=indent)


def _fmt_metric(metric, indent=0):
    if type(metric) in [int, float, bool, str]:
        return metric
    if type(metric) != Counter:
        raise ValueError('Metrics should be primitive types or Counters')
    # The metric is a Counter object
    return '\n' + _fmt_counter(metric, indent=indent)


def _fmt_counter(c: Counter, n=None, indent=0):
    return ''.join([pad((k, v), indent=indent) for k, v in c.most_common(n)])


def fmt_chunk(data: list[tuple], indent=0):
    return (
        ''.join(
            [_fmt_line(dimension, metric, indent=indent)
             for dimension, metric in data]
        )
        + '\n'
    )


def tuple_to_dict(tup):
    a, b = tup
    if isinstance(b, Counter):
        return dict([(a, dict(b))])
    else:
        return dict([tup])


def list_to_dict(l: list[tuple]):
    # All lists happen to be lists of tuples
    dct = {}
    for tup in l:
        dct.update(tuple_to_dict(tup))
    return dct


def dsToDict(ds):
    dct = {}
    for k, v in ds.items():
        if isinstance(v, list):
            dct[k] = list_to_dict(v)
        if isinstance(v, tuple):
            dct[k] = tuple_to_dict(v)

    return dct


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


def make_reports():
    municipalities = Municipality.objects.all()
    for m in tqdm(municipalities):
        report = MunicipalityReport(m)
        if report.no_events:
            continue
        report.export_text()
        report.export_json()


def sort_def_dict(dct: defaultdict) -> defaultdict:
    return sorted(dct.items(), key=lambda kv: kv[1], reverse=True)


"""
from analytics.scripts.muni_report import *
"""

# make_reports()

""" hedensted = Municipality.objects.get(name='Hedensted')
faxe = Municipality.objects.get(name='Faxe Kommune')

start_date = timestamps.get_datetime(2022, 4, 1)
end_date = timestamps.get_datetime(2022, 12, 1)

for m in [hedensted, faxe]:
    report = MunicipalityReport(m, start_date, end_date)
    report.export_text()
    report.export_json()
 """
