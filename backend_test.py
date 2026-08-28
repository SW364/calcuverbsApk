#!/usr/bin/env python3
"""
Backend API tests for grammar/language learning app.
Tests the FastAPI backend via external ingress URL.
"""

import requests
import sys
from pathlib import Path

# Read backend URL from frontend/.env
env_file = Path("/app/frontend/.env")
backend_url = None
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
                backend_url = line.split("=", 1)[1].strip()
                break

if not backend_url:
    print("❌ ERROR: Could not find EXPO_PUBLIC_BACKEND_URL in /app/frontend/.env")
    sys.exit(1)

# All backend routes are prefixed with /api
BASE_URL = f"{backend_url}/api"
print(f"Testing backend at: {BASE_URL}\n")

def test_root_endpoint():
    """Test 1: GET /api/ should return 200 with JSON message"""
    print("=" * 70)
    print("TEST 1: GET /api/ - Root endpoint")
    print("=" * 70)
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Response Body: {data}")
                
                if data.get("message") == "Grammar app API":
                    print("✅ PASS: Root endpoint returns correct message")
                    return True
                else:
                    print(f"❌ FAIL: Expected message 'Grammar app API', got: {data}")
                    return False
            except Exception as e:
                print(f"❌ FAIL: Could not parse JSON response: {e}")
                print(f"Raw response: {response.text[:200]}")
                return False
        else:
            print(f"❌ FAIL: Expected status 200, got {response.status_code}")
            print(f"Response: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with exception: {e}")
        return False


def test_tts_english():
    """Test 2: GET /api/tts?text=I%20can%20cut. should return 200 with audio/mpeg"""
    print("\n" + "=" * 70)
    print("TEST 2: GET /api/tts?text=I%20can%20cut. - English TTS")
    print("=" * 70)
    
    try:
        response = requests.get(
            f"{BASE_URL}/tts",
            params={"text": "I can cut."},
            timeout=30  # TTS might take longer
        )
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        print(f"Content-Length: {len(response.content)} bytes")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'audio/mpeg' in content_type or 'audio/mp3' in content_type:
                if len(response.content) > 0:
                    print("✅ PASS: TTS returns audio/mpeg with non-empty body")
                    return True
                else:
                    print("❌ FAIL: Response body is empty")
                    return False
            else:
                print(f"❌ FAIL: Expected content-type audio/mpeg, got: {content_type}")
                return False
        else:
            print(f"❌ FAIL: Expected status 200, got {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with exception: {e}")
        return False


def test_tts_cache():
    """Test 3: Repeat same TTS request to verify caching still works"""
    print("\n" + "=" * 70)
    print("TEST 3: GET /api/tts?text=I%20can%20cut. - Cache test (repeat)")
    print("=" * 70)
    
    try:
        response = requests.get(
            f"{BASE_URL}/tts",
            params={"text": "I can cut."},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        print(f"Content-Length: {len(response.content)} bytes")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'audio/mpeg' in content_type or 'audio/mp3' in content_type:
                if len(response.content) > 0:
                    print("✅ PASS: Cached TTS request returns audio/mpeg successfully")
                    return True
                else:
                    print("❌ FAIL: Response body is empty")
                    return False
            else:
                print(f"❌ FAIL: Expected content-type audio/mpeg, got: {content_type}")
                return False
        else:
            print(f"❌ FAIL: Expected status 200, got {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with exception: {e}")
        return False


def test_tts_spanish():
    """Test 4: GET /api/tts?text=Yo%20puedo%20cortar. - Spanish TTS"""
    print("\n" + "=" * 70)
    print("TEST 4: GET /api/tts?text=Yo%20puedo%20cortar. - Spanish TTS")
    print("=" * 70)
    
    try:
        response = requests.get(
            f"{BASE_URL}/tts",
            params={"text": "Yo puedo cortar."},
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        print(f"Content-Length: {len(response.content)} bytes")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'audio/mpeg' in content_type or 'audio/mp3' in content_type:
                if len(response.content) > 0:
                    print("✅ PASS: Spanish TTS returns audio/mpeg with non-empty body")
                    return True
                else:
                    print("❌ FAIL: Response body is empty")
                    return False
            else:
                print(f"❌ FAIL: Expected content-type audio/mpeg, got: {content_type}")
                return False
        else:
            print(f"❌ FAIL: Expected status 200, got {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with exception: {e}")
        return False


def test_tts_empty_text():
    """Test 5: GET /api/tts?text= - Should return 4xx validation error"""
    print("\n" + "=" * 70)
    print("TEST 5: GET /api/tts?text= - Empty text validation")
    print("=" * 70)
    
    try:
        response = requests.get(
            f"{BASE_URL}/tts",
            params={"text": ""},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        
        if 400 <= response.status_code < 500:
            print(f"Response: {response.text[:500]}")
            print("✅ PASS: Empty text returns 4xx validation error as expected")
            return True
        else:
            print(f"❌ FAIL: Expected 4xx status, got {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with exception: {e}")
        return False


def main():
    """Run all backend tests"""
    print("\n" + "=" * 70)
    print("BACKEND API TEST SUITE - Grammar/Language Learning App")
    print("=" * 70)
    
    results = []
    
    # Run all tests
    results.append(("Root endpoint", test_root_endpoint()))
    results.append(("TTS English", test_tts_english()))
    results.append(("TTS Cache", test_tts_cache()))
    results.append(("TTS Spanish", test_tts_spanish()))
    results.append(("TTS Empty validation", test_tts_empty_text()))
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
