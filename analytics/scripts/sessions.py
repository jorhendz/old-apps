from datetime import datetime, timedelta
from accounts.models import CustomUser
from analytics.user_sessions import UserSessions
from providers.models.municipality import Municipality
from providers.models.social_worker import SocialWorker


def longest_sessions():
    users = CustomUser.objects.all()
    us_objects = [UserSessions(u) for u in users]
    longest = []
    for us in us_objects:
        if not us.sessions:
            continue
        user_s_lengths = sorted(us.session_lengths(), reverse=True)
        longest.append(user_s_lengths[0])

    return sorted(longest, reverse=True)


def shortest_sessions():
    users = CustomUser.objects.all()
    us_objects = [UserSessions(u) for u in users]
    shortest = []
    for us in us_objects:
        if not us.sessions:
            continue
        user_s_lengths = sorted(us.session_lengths(), reverse=True)
        shortest.append(user_s_lengths[-1])

    return sorted(shortest)


def avg_session_length():
    """Average session length of all users"""
    users = CustomUser.objects.all()
    averages = []
    session_count = 0
    for u in users:
        us = UserSessions(u)
        if not us.sessions:
            continue

        if len(us.sessions) > 0:

            user_avg_sesh_length = sum(
                [s.length() for s in us.sessions], timedelta()
            ) / len(us.sessions)

            averages.append(user_avg_sesh_length)
            session_count += len(us.sessions)

    return str(sum(averages, timedelta()) / session_count)


def avg_session_length_user(user: CustomUser, start_date, end_date):
    us = UserSessions(user, start_date, end_date)
    if not us.sessions:
        return None

    if len(us.sessions) > 1:
        return sum([s.length() for s in us.sessions], timedelta()) / len(us.sessions)


def avg_session_length_muni(m: Municipality, start_date, end_date):
    if not m:
        return m
    soc_workers = SocialWorker.objects.filter(municipality=m)
    averages = []
    for soc_worker in soc_workers:
        avg = avg_session_length_user(soc_worker.user, start_date, end_date)
        if avg:
            averages.append(avg)
    try:
        return sum(averages, timedelta()) / len(averages)
    except ZeroDivisionError:
        return None


def num_sessions_muni(m: Municipality, start_date, end_date):
    soc_workers = SocialWorker.objects.filter(municipality=m)

    count = 0
    for soc_worker in soc_workers:
        us = UserSessions(soc_worker.user, start_date, end_date)
        count += len(us.sessions)
    return count


"""
from analytics.scripts.sessions import *
"""
