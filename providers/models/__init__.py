from django.contrib.auth.models import AnonymousUser

from .provider import Provider, Membership
from .municipality import Municipality
from .shared_knowledge import SharedKnowledge
from .social_worker import SocialWorker
from .service import Service
from .creditation import Creditation
from .language import Language
from .theme import Theme
from .work_method import WorkMethod
from .service_category import ServiceCategory
from .region import Region
from .postal_code import PostalCode
from .area import Area
from .professional_subscriber import ProfessionalSubscriber
from .toolbox_tool import ToolboxTool


def get_user_information(user):

    # If the user is not logged in, return None, since AnonymousUser is not iterable
    if isinstance(user, AnonymousUser):
        return None

    try:
        return SocialWorker.objects.get(user=user)
    except SocialWorker.DoesNotExist:
        pass

    try:
        return Provider.objects.get(user=user)
    except Provider.DoesNotExist:
        pass

    try:
        return ProfessionalSubscriber.objects.get(user=user)
    except ProfessionalSubscriber.DoesNotExist:
        pass

    return None


def get_user_type(user):

    # If the user is not logged in, return None, since AnonymousUser is not iterable
    if isinstance(user, AnonymousUser):
        return None

    if user.is_admin:
        return 'Admin'

    try:
        if SocialWorker.objects.get(user=user) != None:
            return SocialWorker.__name__
    except SocialWorker.DoesNotExist:
        pass

    try:
        if Provider.objects.get(user=user) != None:
            return Provider.__name__
    except Provider.DoesNotExist:
        pass

    try:
        if ProfessionalSubscriber.objects.get(user=user) != None:
            return ProfessionalSubscriber.__name__
    except ProfessionalSubscriber.DoesNotExist:
        pass

    return None


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
