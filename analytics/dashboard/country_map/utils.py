import json
import math
from pprint import pprint
import pandas as pd
import numpy as np

from django.db.models.query import QuerySet

from providers.models import Municipality


def to_dict(df: pd.DataFrame, dimension_col: str, metric_col: str) -> dict:
    dct = pd.Series(df[metric_col].values, index=df[dimension_col]).to_dict()
    return dct


def df_to_json(df: pd.DataFrame, metric_col: str) -> str:
    df = remove_null_rows(df, metric_col)
    _dict = to_dict(df, 'municipality', metric_col)
    return json.dumps(_dict)


def translate_to_range(value, old_min, old_max, new_min, new_max):
    """
    I want to change the value 0.2 to a number between 42 and 18,
    with 18 being the highest number.
    The old range was [0; 1]:

    translate(0.2, 0, 1, 42, 18) -> 37.2

    and if I let 42 be the highest number of the new range:

    translate(0.2, 0, 1, 18, 42) -> 22.8
    """
    # Figure out how 'wide' each range is
    old_range = old_max - old_min
    new_range = new_max - new_min

    # Convert the left range into a 0-1 range (float)
    value_scaled = float(value - old_min) / float(old_range)

    # Convert the 0-1 range into a value in the right range.
    return new_min + (value_scaled * new_range)


def muni_names() -> QuerySet:
    """The names of all municipalities"""
    return Municipality.objects.all().values_list('name', flat=True)


def remove_non_geographical_munis(df: pd.DataFrame) -> pd.DataFrame:
    """These 'Municipalities' are not actually municipalities
    and can therefore not appear on a map"""
    not_municipalities = [
        'Børnebasen',
        'Børnebasen ApS',
        'Røde Kors',
        'Falkenberg',
        'Rådgivnings Danmark',
        'Bornholms Regionskommune',
        'København',  # It's called 'Københavns Kommune'
    ]
    remove_unwanted_munis(not_municipalities)


def remove_unwanted_munis(df: pd.DataFrame, unwanted: list[str]) -> pd.DataFrame:
    return df[~df['municipality'].isin(unwanted)]


def remove_null_rows(df: pd.DataFrame, metric_col: str) -> pd.DataFrame:
    return df[df[metric_col] != 0]


class PaginatedDataFrame:
    def __init__(self, df, rows_per_page=10) -> None:
        self.df = df
        self.rows_per_page = rows_per_page

    def num_rows(self):
        return len(self.df.index)

    def num_pages(self):
        return math.ceil(self.num_rows() / self.rows_per_page)

    def page(self, n) -> pd.DataFrame:
        i = (n - 1) * self.rows_per_page
        j = min(n * self.rows_per_page, self.num_rows())
        return self.df[i:j]
