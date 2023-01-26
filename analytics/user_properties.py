from django.contrib.auth.models import AnonymousUser

from providers.models import get_user_information, get_user_type
from providers.models.professional_subscriber import ProfessionalSubscriber
from providers.models.provider import Provider
from accounts.models import CustomUser
from providers.models.social_worker import SocialWorker

provider_user = 20467
prof_sub_user = 20484
social_worker_user = 20471


def get_user_organization(user):
    instance = get_user_information(user)
    if isinstance(instance, Provider):
        return instance.name
    if isinstance(instance, SocialWorker):
        return instance.municipality
    if isinstance(instance, ProfessionalSubscriber):
        return instance.municipality
    if hasattr(user, 'is_admin'):
        if user.is_admin:
            return 'Admin'

    if isinstance(instance, AnonymousUser):
        print("he iiiiiiis")
        return AnonymousUser.__name__
    print(f'Warning: analytics.user_properties.get_user_organization({user})')
