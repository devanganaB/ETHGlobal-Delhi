import requests

def get_leetcode_data(username):
    """Get Leetcode data for user'."""

    # Get weather data
    wx_resp = requests.get(
        f"http://localhost:3000/userProfile/{username}",
    )
    if wx_resp.status_code != 200:
        raise RuntimeError(f"Open-Meteo {wx_resp.status_code}: {wx_resp.text[:120]}")
    return wx_resp.json()