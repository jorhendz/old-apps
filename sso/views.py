from django.shortcuts import redirect
from django.contrib.auth import login
from django.core.exceptions import ObjectDoesNotExist

from accounts.models import CustomUser
from providers.models import SocialWorker, Municipality
from sso.auth.auth_code_flow import TokenClaims, get_sign_in_flow, get_token_from_code

TENANT_TO_MUNICIPALITY = {
    "dccefce7-6d47-4376-b75e-3968cb1b031b": "Børnebasen ApS",
    "3b718dd6-96e1-44e0-b220-3d816a179702": "Sønderborg",
    "a60a5eec-ec78-4f2c-9bb2-061d2dfe81d8": "Hedensted",
    # Activate to test with DTU login
    # "f251f123-c9ce-448e-9277-34bb285911d9": "Sønderborg",
}


def sign_in(request):
    # Get the sign-in flow
    flow = get_sign_in_flow()

    # Save the expected flow so we can use it in the callback
    request.session["auth_flow"] = flow

    # Redirect to the Azure sign-in page
    return redirect(flow["auth_uri"])


def callback(request):
    # Make the token request
    token = get_token_from_code(request)

    print(token)

    # Extract user information, which is given in the Id token claims
    claims = TokenClaims.from_token(token)

    # Get the organization form which the user tries to login.
    # Raises an ValueError when the user tries to login from
    # non-partnering orginizations with SSO, e.g. @dtu.dk
    # TODO: Redirect to a page saying that your organization doesn't
    # have SSO if an unknown organization tries to login
    try:
        municipality_name = TENANT_TO_MUNICIPALITY[claims.tenant_id]
    except KeyError:
        return redirect("/login")
    municipality = Municipality.objects.get(name=municipality_name)

    # Get or create user, from authenticated account
    try:
        user = CustomUser.objects.get(email=claims.preferred_username)
    except ObjectDoesNotExist:
        user = CustomUser(email=claims.preferred_username, name=claims.name)
        user.save()

        social_worker = SocialWorker(user=user, municipality=municipality)
        social_worker.save()

    login(request, user)

    return redirect("/")
