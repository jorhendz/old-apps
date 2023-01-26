import json
from pprint import pprint
from textwrap import dedent
import pandas as pd
import numpy as np

from analytics.dashboard.country_map.events import muni_events_df
from analytics.dashboard.country_map import utils
from analytics.dashboard.country_map.users import (
    muni_social_workers_df,
    social_worker_counts,
)


def page_json(page, df, metric_col) -> str:
    df = utils.remove_null_rows(df, metric_col)
    pdf = utils.PaginatedDataFrame(df)
    page = pdf.page(page)
    return utils.df_to_json(page, metric_col)


class MapOfDenmark:
    """An SVG choropleth map of Denmark that displays
    each municipality in a certain color representing an integer.
    The color range is a gradient between two brand colors."""

    def event_count(self):
        # todo: Include time range as a Q object
        df = muni_events_df()
        return utils.df_to_json(df, metric_col='event_count')

    def event_count_page(self, page):
        df = muni_events_df()
        return page_json(page, df, 'event_count')

    def social_workers(self):
        df = muni_social_workers_df()
        return utils.df_to_json(df, metric_col='social_workers')

    def social_workers_page(self, page):
        df = muni_social_workers_df()
        return page_json(page, df, 'social_workers')

    # Old stuff from here on out. Can populate a <style> tag
    def css(self, df: pd.DataFrame, metric_col) -> str:
        """Return the CSS needed to color the map of denmark.
        metric_col: The name of the column that contains the numbers."""
        has_events = df[df[metric_col] != 0]
        values = utils.to_dict(
            has_events, dimension_col='municipality', metric_col=metric_col
        )

        min_val = min(values.values())
        max_val = max(values.values())

        _css = '\n'.join(
            [
                self.css_rule(m_name, val, min_val, max_val)
                for m_name, val in values.items()
            ]
        )

        return f'{_css}'

    def val_to_color(self, val, min_val, max_val) -> str:
        # $mint: hsl(169, 42%, 72%);
        # $mint-dark: hsl(169, 18%, 35%);
        hue = 169
        saturation = utils.translate_to_range(val, min_val, max_val, 42, 18)
        lightness = utils.translate_to_range(val, min_val, max_val, 72, 35)
        return f'hsl({hue}, {saturation}%, {lightness}%)'

    def css_rule(self, municipality_name: str, val, min_val, max_val) -> str:
        """lerped_val: Value between 0 and 1 inclusive"""
        color = self.val_to_color(val, min_val, max_val)
        return f'[data-name="{municipality_name}"]{{fill:{color};}}'
