import requests
import time

def test_rate_limiting():
    url = "http://127.0.0.1:8000/api/v1/auth/register"
    print(f"Testing rate limiting on {url}...")
    
    payload = {
        "username": "rate_test",
        "password": "password123",
        "role": "student"
    }
    
    for i in range(10):
        try:
            start = time.time()
            # We don't care if registration fails due to existing user, 
            # we just want to see if we get a 429
            response = requests.post(url, json=payload)
            duration = time.time() - start
            print(f"Request {i+1}: Status {response.status_code} ({duration:.3f}s)")
            if response.status_code == 429:
                print(">>> Rate limit HIT! (429 Too Many Requests)")
                return True
        except Exception as e:
            print(f"Request {i+1} failed: {e}")
    
    print(">>> Rate limit NOT hit after 10 requests.")
    return False

if __name__ == "__main__":
    test_rate_limiting()
