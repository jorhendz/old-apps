from analytics.models import *
from analytics.utils import get_user_events
from providers.models.social_worker import SocialWorker, Municipality
from accounts.models import CustomUser


# Nice to have example:

'''
sønderborg = {
    social_workers = [
        {
            id: 123,
            events: {
                pageview: [
                    {'/search/qt=dsa98d'},
                    {'/search/qt=j89fdsfd'},
                    {'/search/qt=dssdas'},
                ],
                login: [],
                search: [],
            }
        }
    ]
}
'''


def municipality_events(municipality):
    soc_workers = municipality.socialworker_set.all()
    m_events = []
    for soc_worker in soc_workers:
        ue = get_user_events(soc_worker.user)
        m_events.extend(ue)
    return m_events


def soc_worker_events(social_worker):
    event_types = [
        PageViewEvent.__name__,
        LoginEvent.__name__,
        RegisterEvent.__name__,
        SearchEvent.__name__,
    ]
    soc_worker_events = {event_type: [] for event_type in event_types}
    base_events = get_user_events(social_worker.user)
    for base_event in base_events:
        event = base_event.get_parent()
        event_type = event.__class__.__name__
        soc_worker_events[event_type].append(event)
    return soc_worker_events


def soc_worker_data(soc_worker_id):
    soc_worker = SocialWorker.objects.get(soc_worker_id)
    return {'id': soc_worker_id, 'events': []}


def soc_workers_data(municipality__name):
    return {'social_workers': []}
