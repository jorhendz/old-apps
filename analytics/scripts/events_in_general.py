from analytics.models import LoginEvent, PageViewEvent, RegisterEvent, SearchEvent
from analytics.scripts.something import municipality_events
from analytics.utils import events_30_days, events_3_months
from providers.models import Municipality


### All municipalities ###


### Single municipality ###
m = Municipality.objects.get(name='Sønderborg')
events = municipality_events(m)


def _obj_name(e):
    return e.__class__.__name__


def _model_name(m):
    return m.__name__


def _is(model, e):
    return _obj_name(e) == _model_name(model)


def event_types(municipality: Municipality) -> list[str]:
    base_events = municipality_events(municipality)
    events = [e.get_parent() for e in base_events]

    return {
        _model_name(PageViewEvent): list(
            filter(lambda e: _is(PageViewEvent, e), events)
        ),
        _model_name(SearchEvent): list(filter(lambda e: _is(SearchEvent, e), events)),
        _model_name(LoginEvent): list(filter(lambda e: _is(LoginEvent, e), events)),
        _model_name(RegisterEvent): list(
            filter(lambda e: _is(RegisterEvent, e), events)
        ),
    }


"""
from analytics.scripts.events_in_general import *
"""
