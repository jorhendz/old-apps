from django.contrib.auth.models import AnonymousUser

from .models import get_user_information


class GAUserInfo:
    """User information to be sent to the GTM config tag via the data layer.
    Must not contain any personally identifiable information.
    This includes information that is only personally identifiable
    when combined with another piece of information."""

    def __init__(self, user_from_request) -> None:
        # Use the user is not logged in, avoid exceptions
        if isinstance(user_from_request, AnonymousUser):
            self.id = ""
            self.type = ""
            return

        user = get_user_information(user_from_request)
        self.id = user.id
        self.type = get_user_type(user)

        # Set organization
        if self.type == 'SocialWorker':
            self.organization = user.municipality
        if self.type == 'ProfessionalSubscriber':
            self.organization = user.municipality
        if self.type == 'Provider':
            self.organization = user.name

    def __str__(self):
        return f'''
        User ID:             {self.id}
        User type:           {self.type}
        User organization:   {self.organization}
        '''


def get_user_type(user) -> str:
    return user.__class__.__name__
