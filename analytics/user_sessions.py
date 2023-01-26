from datetime import datetime, timedelta
from rest_framework.response import Response

from accounts.models import CustomUser
from accounts.utils import to_local_time
from analytics.api import AnalyticsEventSerializer, LoginEventSerializer
from analytics.events import EventFactory
from analytics.models import AnalyticsEvent, LoginEvent, PageViewEvent, RegisterEvent


# from analytics.dosth import *


def events_for_user(user: CustomUser):
    return PageViewEvent.objects.filter(base_event__user_id=user.id)


def base_events_for_user(user: CustomUser, start_date, end_date):
    return AnalyticsEvent.objects.filter(user_id=user.id).filter(
        timestamp__range=(start_date, end_date)
    )


def get_parent_event(base_event: AnalyticsEvent):
    # How to generalize this?
    try:
        return PageViewEvent.objects.get(base_event__id=base_event.id)
    except PageViewEvent.DoesNotExist:
        pass

    try:
        return LoginEvent.objects.get(base_event__id=base_event.id)
    except LoginEvent.DoesNotExist:
        pass

    try:
        return RegisterEvent.objects.get(base_event__id=base_event.id)
    except RegisterEvent.DoesNotExist:
        pass


def timestamps_for_user(user: CustomUser):
    events = events_for_user(user)
    timestamps = [event.base_event.timestamp for event in events]

    return timestamps


class EventDTO:
    def __init__(self, base_event) -> None:
        self.base_event = base_event
        self.parent = base_event.get_parent()

    def serialize(self) -> Response:
        serializer = AnalyticsEventSerializer(self.base_event)
        parent_name = self.parent.__class__.__name__
        if parent_name is None:
            parent_name = ''
        response = {
            'event_name': parent_name,
            'base_event': serializer.data,
        }
        return Response(response)


class UserSessions:
    """All user sessions belonging to a specific user"""

    def __init__(self, user, start_date, end_date) -> None:
        self.user = user
        sessions_list = session_info(user, start_date, end_date)
        if sessions_list is None:
            self.sessions = None
            print("oh lord")
            return

        self.sessions = [UserSession(event_list) for event_list in sessions_list]

    def serialize(self) -> Response:
        if not self.sessions:
            print("i think NOOOT")
        response = {'sessions': [s.serialize().data for s in self.sessions]}
        return Response(response)

    def session_lengths(self):
        return [s.length() for s in self.sessions]


class UserSession:
    """A UserSession:

        Has at least two events.
        Ends after 30 minutes of inactivity
        (Keeping it simple for now).

    A UserSession is not stored in the database but rather
    calculated from a user's events.
    """

    def __init__(self, base_events) -> None:
        self.base_events = base_events

    def start_time(self) -> datetime:
        return self.base_events[0].timestamp

    def length(self) -> timedelta:
        """Calculate session length"""
        first_event_ts = self.base_events[0].timestamp
        last_event_ts = self.base_events[-1].timestamp
        session_length = last_event_ts - first_event_ts

        assert session_length > timedelta(0)
        return session_length

    def serialize(self) -> Response:
        response = {
            'start_time': self.start_time(),
            'length': str(self.length()),
            'events': [],
        }
        for e in self.base_events:
            dto = EventDTO(e)
            response['events'].append(dto.serialize().data)

        return Response(response)

    def __str__(self) -> str:
        string = ''
        for event in self.base_events:
            parent_event = get_parent_event(event)
            string += f'{event.timestamp} - {parent_event.__class__.__name__}' + '\n'
        return string


class UserSessionsDTO:
    def __init__(self, user_sessions: UserSessions) -> None:
        self.user_sessions = user_sessions

    def to_dict(self):
        response = [
            {
                'start_time': s.start_time(),
                'length': str(s.length()),
                'event_count': len([e for e in s.base_events]),
            }
            for s in self.user_sessions.sessions
        ]
        return response


def session_info(user: CustomUser, start_date, end_date):
    """A session:
    Has at least two events.
    Ends after 30 minutes of inactivity."""

    events = list(base_events_for_user(user, start_date, end_date))
    if events == []:
        return []

    sessions = []
    current_session = [events[0]]
    session_num = 0

    LAST_ITERATION = len(events) - 2
    for i in range(1, len(events[:-1])):
        last_event = events[i - 1]
        event = events[i]
        next_event = events[i + 1]

        last_ts = last_event.timestamp
        ts = event.timestamp
        next_ts = next_event.timestamp

        diff_prev = ts - last_ts
        diff_next = next_ts - ts

        print_msg = ''
        if diff_next >= timedelta(minutes=30):
            print_msg = 'SESSION_END'

        if diff_prev >= timedelta(minutes=30):
            print_msg = 'SESSION_START'

            if len(current_session) > 1:
                sessions.append(current_session)
                session_num += 1
            current_session = []

        current_session.append(event)

        if i == LAST_ITERATION:

            if len(current_session) > 1:
                # Don't forget the last event
                if diff_next <= timedelta(minutes=30):
                    print_msg = 'SESSION_END'
                    current_session.append(next_event)
                sessions.append(current_session)
            current_session = []

        # print(f'{ts}\t{session_num}\t\t{i} {len(events)}')

    return sessions


def intervals_for_user(user: CustomUser) -> list[timedelta]:
    timestamps = timestamps_for_user(user)

    intervals = []
    for i in range(1, len(timestamps)):
        t0 = timestamps[i - 1]
        t1 = timestamps[i]
        dt = t1 - t0
        intervals.append(dt)

    return intervals


def number_of_sessions(user: CustomUser) -> int:

    timestamps = timestamps_for_user(user)

    num = 0
    for i in range(1, len(timestamps)):
        intv = timestamps[i]
        t1 = intv
        t0 = timestamps[i - 1]
        dt = t1 - t0

        # Send a Session End event with the same timestamp
        # as the last event in that session
        if dt > timedelta(minutes=30):
            num += 1


def largest_interval(time_intervals: list[timedelta]) -> timedelta:

    # Start with a tiny interval
    largest = timedelta(milliseconds=1)
    for intv in time_intervals:
        if intv > largest:
            largest = intv

    return largest
