import datetime
from django.conf import settings
from pytz import timezone


def to_local_time(dt: datetime.datetime):
    '''Strictly for presentation'''
    settings_time_zone = timezone(settings.TIME_ZONE)
    return dt.astimezone(settings_time_zone)
