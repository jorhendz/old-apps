from collections import defaultdict

import pandas as pd
from django.db.models.query import QuerySet
from analytics.dashboard.country_map import utils

from analytics.models import AnalyticsEvent


def muni_events_df() -> pd.DataFrame:
    """Create a DataFrame with municipality names and event counts"""
    muni_names = utils.muni_names()
    m_event_counts = muni_event_counts(muni_names)

    df = pd.DataFrame(m_event_counts.items(), columns=['municipality', 'event_count'])
    df = clean(df)
    return df.sort_values(by=['event_count'], ascending=False)


def muni_event_counts(muni_names: QuerySet) -> defaultdict:
    """Create a dictioanry with municipality names as keys
    and their event counts as values"""
    m_event_counts = defaultdict(int)
    for m_name in muni_names:
        event_count = AnalyticsEvent.objects.filter(user_organization=m_name).count()
        m_event_counts[m_name] += event_count
    return m_event_counts


def clean(df: pd.DataFrame) -> pd.DataFrame:
    # Convert strings to ints
    df['event_count'] = df['event_count'].astype(int)
    df = utils.remove_null_rows(df, 'event_count')
    return utils.remove_unwanted_munis(df, ['Børnebasen'])


"""
from analytics.dashboard.country_map.muni_events import *
"""
