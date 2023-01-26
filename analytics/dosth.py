from pprint import pprint

from accounts.models import *
from analytics.models import SearchEvent
from analytics.user_sessions import *
from analytics.utils import find_successful_searches


user = CustomUser.objects.get(pk=20111)  # provider

events = AnalyticsEvent.objects.filter(user_id=user.id)

successful_searches = find_successful_searches(user)
