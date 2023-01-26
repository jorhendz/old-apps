import msal

from dataclasses import dataclass
from django.conf import settings
from django.core.exceptions import PermissionDenied


"""

"""


@dataclass
class TokenClaims:
    preferred_username: str
    name: str
    tenant_id: str

    @classmethod
    def from_token(cls, token):
        if "error" in token:
            raise PermissionDenied

        id_token_claims = token.get("id_token_claims")

        preferred_username = id_token_claims["preferred_username"]
        name = id_token_claims["name"]
        tenant_id = id_token_claims["tid"]

        return cls(preferred_username, name, tenant_id)


def load_cache(request):
    # Check for a token cache in the session
    cache = msal.SerializableTokenCache()

    if request.session.get("token_cache"):
        cache.deserialize(request.session["token_cache"])

    return cache


def save_cache(request, cache):
    # If cache has changed, persist back to session
    if cache.has_state_changed:
        request.session["token_cache"] = cache.serialize()


def get_msal_app(cache=None):
    # Initialize the MSAL confidential client
    auth_app = msal.ConfidentialClientApplication(
        settings.SSO_CLIENT_ID,
        client_credential=settings.SSO_CLIENT_SECRET,
        authority=settings.SSO_AUTHORITY,
        token_cache=cache,
    )

    return auth_app


# Method to generate a sign-in flow
def get_sign_in_flow():
    auth_app = get_msal_app()

    return auth_app.initiate_auth_code_flow(
        settings.SSO_SCOPES, redirect_uri=settings.SSO_REDIRECT
    )


# Method to exchange auth code for access token
def get_token_from_code(request):
    cache = load_cache(request)
    auth_app = get_msal_app(cache)

    # Get the flow saved in session
    flow = request.session.pop("auth_flow", {})

    result = auth_app.acquire_token_by_auth_code_flow(flow, request.GET)
    save_cache(request, cache)

    return result
