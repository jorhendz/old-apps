import datetime
import pytz

"""
We save all timestamps within the UTC timezone.
Only when showing them to the end users, do we convert them to Danish time.
"""

DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

month_names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]


class MonthRanges:
    """JANUARY = (get_datetime(), get_datetime())
    FEBRUARY = (get_datetime(), get_datetime())
    MARCH = (get_datetime(), get_datetime())
    APRIL = (get_datetime(), get_datetime())
    MAY = (get_datetime(), get_datetime())
    JUNE = (get_datetime(), get_datetime())
    JULY = (get_datetime(), get_datetime())
    AUGUST = (get_datetime(), get_datetime())
    SEPTEMBER = (get_datetime(), get_datetime())
    OCTOBER = (get_datetime(), get_datetime())
    NOVEMBER = (get_datetime(), get_datetime())
    DECEMBER = (get_datetime(), get_datetime())"""

    pass


def get_datetime(
    year, month, day, hour=0, minute=0, second=0, microsecond=0
) -> datetime.datetime:
    """Providing a method to create a datetime.datetime object,
    so that we never miss a timezone (UTC)."""
    return datetime.datetime(
        year=year,
        month=month,
        day=day,
        hour=hour,
        minute=minute,
        second=second,
        microsecond=microsecond,
        tzinfo=datetime.timezone.utc,
    )


def get_now() -> datetime.datetime:
    return datetime.datetime.now(datetime.timezone.utc)


def utc_to_local(utc_dt: datetime.datetime) -> datetime.datetime:
    if utc_dt.tzinfo != datetime.timezone.utc:
        raise ValueError(f'utc_dt.tzinfo == {utc_dt.tzinfo}. It must be UTC')

    return utc_dt.replace(tzinfo=datetime.timezone.utc).astimezone(
        tz=pytz.timezone('Europe/Copenhagen')
    )


def to_string(dt: datetime.datetime, format=DATE_FORMAT) -> str:
    """Prints a datetime in the American format"""
    return dt.strftime(format)


def from_string(dt_str: str, format=DATE_FORMAT):
    return datetime.strptime(dt_str, format).astimezone(tz=pytz.utc)
