import pandas as pd

from analytics.dashboard.country_map.users import muni_social_workers_df
from analytics.dashboard.country_map import utils


def textlist():
    df = muni_social_workers_df()
    json = utils.df_to_json(df, 'social_workers')
    print(json)


textlist()

"""
from analytics.dashboard.lists import *
"""
