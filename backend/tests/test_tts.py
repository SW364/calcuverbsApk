"""Backend tests for TTS endpoint."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://touch-verb-carousel.preview.emergentagent.com").rstrip("/")


@pytest.fixture
def api_client():
    s = requests.Session()
    return s


def test_root(api_client):
    r = api_client.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert r.json().get("message")


def test_tts_returns_audio(api_client):
    r = api_client.get(f"{BASE_URL}/api/tts", params={"text": "You can cut."}, timeout=30)
    assert r.status_code == 200, r.text
    assert r.headers.get("content-type", "").startswith("audio/mpeg")
    assert len(r.content) > 1000  # non-empty mp3


def test_tts_caching_faster_second(api_client):
    phrase = "She cannot swim."
    t0 = time.time(); r1 = api_client.get(f"{BASE_URL}/api/tts", params={"text": phrase}, timeout=30); d1 = time.time() - t0
    t0 = time.time(); r2 = api_client.get(f"{BASE_URL}/api/tts", params={"text": phrase}, timeout=30); d2 = time.time() - t0
    assert r1.status_code == 200 and r2.status_code == 200
    assert r1.content == r2.content
    # cached call should be much faster (heuristic: <1s if cached)
    assert d2 < max(d1, 1.0), f"cache slow: first={d1:.2f}s second={d2:.2f}s"


def test_tts_validation(api_client):
    r = api_client.get(f"{BASE_URL}/api/tts", params={"text": ""})
    assert r.status_code == 422


@pytest.mark.parametrize("text", [
    "I can cut.",
    "You cannot cut.",
    "Can you cut?",
    "She might not sing.",
    "Would they dance?",
])
def test_tts_multiple_phrases(api_client, text):
    r = api_client.get(f"{BASE_URL}/api/tts", params={"text": text}, timeout=30)
    assert r.status_code == 200
    assert len(r.content) > 500
