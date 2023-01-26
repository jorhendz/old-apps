from django.http import HttpResponseRedirect
from functools import wraps
from enum import Enum

from analytics.events import EventFactory

from .models import (
    get_user_information,
    Provider,
    SocialWorker,
    ProfessionalSubscriber,
    Membership,
)


def _redirect_to_user_home(request):
    if request.user.is_superuser:
        return HttpResponseRedirect("/admin/")

    user = get_user_information(request.user)
    if user is None:
        return HttpResponseRedirect('/login/')
    if isinstance(user, SocialWorker):
        return HttpResponseRedirect("/search/")
    if isinstance(user, ProfessionalSubscriber):
        return HttpResponseRedirect("/search/")
    if isinstance(user, Provider):
        return HttpResponseRedirect("/profile/")


def user_types_allowed(*model_classes):
    """Decorator for views.
    Takes a class as input.
    If the user is not an instance of that class,
    it is redirected according to _redirect_to_user_home()"""

    def _decorate(view_func):
        @wraps(view_func)
        def wrapped_func(request, *args, **kwargs):
            for model_class in model_classes:
                user = get_user_information(request.user)
                if isinstance(user, model_class):
                    return view_func(request, *args, **kwargs)
            return _redirect_to_user_home(request)

        return wrapped_func

    return _decorate


def page_view_event():
    """Send a pageview to the analytics schema"""

    def _decorate(view_func):
        @wraps(view_func)
        def wrapped_func(request, *args, **kwargs):
            EventFactory(request.user).page_view(request)
            return view_func(request, *args, **kwargs)

        return wrapped_func

    return _decorate


def membership_level_sufficient(membership: int, membership_required: int) -> bool:
    return membership >= membership_required


def membership_required(membership):
    """Decorator for views that require a certain membership.
    Pass the minimum membership needed.
    For the sake of maintainability, use the Membership class.
    Example usage: A view requires a membership of BASIS or higher:
    @membership_required(Membership.BASIS)"""

    def _decorate(view_func):
        @wraps(view_func)
        def wrapped_func(request, *args, **kwargs):
            # Get user's membership and redirect
            # if user is not a provider
            user = get_user_information(request.user)
            if not isinstance(user, Provider):
                return _redirect_to_user_home(request)
            user_membership = user.membership

            if membership_level_sufficient(user_membership, membership):
                return view_func(request, *args, **kwargs)
            return _redirect_to_user_home(request)

        return wrapped_func

    return _decorate
