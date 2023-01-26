import requests


GRAPH_URL = "https://graph.microsoft.com/v1.0"


def get_user(token):
    # Send GET to /me
    user = requests.get(
        f"{GRAPH_URL}/me",
        headers={f"Authorization": "Bearer {token}"},
        params={"$select": "displayName,mail"},
    )

    # Return the JSON result
    return user.json()
