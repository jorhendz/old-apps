from collections import defaultdict

import pandas as pd
from django.db.models.query import QuerySet

from analytics.dashboard.country_map import utils
from providers.models import SocialWorker


def muni_social_workers_df() -> pd.DataFrame:
    """Create a DataFrame with municipality names and user counts"""
    muni_names = utils.muni_names()
    sw_counts = social_worker_counts(muni_names)
    df = pd.DataFrame(sw_counts.items(), columns=['municipality', 'social_workers'])
    df = clean(df)
    return df.sort_values(by=['social_workers'], ascending=False)


def social_worker_counts(muni_names: QuerySet) -> defaultdict:
    counts = defaultdict(int)
    for m_name in muni_names:
        count = SocialWorker.objects.filter(municipality__name=m_name).count()
        counts[m_name] += count
    return counts


def clean(df: pd.DataFrame) -> pd.DataFrame:
    # Convert strings to ints
    df['social_workers'] = df['social_workers'].astype(int)
    df = utils.remove_null_rows(df, 'social_workers')
    return utils.remove_unwanted_munis(df, ['Børnebasen'])
