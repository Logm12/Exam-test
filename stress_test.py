import requests
import time
from concurrent.futures import ThreadPoolExecutor
import statistics

TARGET_URL = "https://fdbtalent.vnuis.edu.vn/"
CONCURRENT_USERS = 75
REQUESTS_PER_USER = 1

def make_request(user_id):
    results = []
    for i in range(REQUESTS_PER_USER):
        start = time.time()
        try:
            response = requests.get(TARGET_URL, timeout=10)
            duration = time.time() - start
            results.append({"status": response.status_code, "time": duration})
        except Exception as e:
            results.append({"status": "ERROR", "time": time.time() - start, "error": str(e)})
    return results

def run_stress_test():
    print(f"Starting stress test for {TARGET_URL}")
    print(f"Users: {CONCURRENT_USERS}, Total Requests: {CONCURRENT_USERS * REQUESTS_PER_USER}")
    
    all_results = []
    start_time = time.time()
    
    with ThreadPoolExecutor(max_workers=CONCURRENT_USERS) as executor:
        futures = [executor.submit(make_request, i) for i in range(CONCURRENT_USERS)]
        for future in futures:
            all_results.extend(future.result())
            
    end_time = time.time()
    total_duration = end_time - start_time
    
    # Analysis
    successes = [r for r in all_results if r["status"] == 200]
    errors = [r for r in all_results if r["status"] == "ERROR"]
    other = [r for r in all_results if r["status"] not in [200, "ERROR"]]
    
    times = [r["time"] for r in successes]
    
    print("\n" + "="*30)
    print("STRESS TEST RESULTS")
    print("="*30)
    print(f"Total time: {total_duration:.2f}s")
    print(f"Throughput: {len(all_results)/total_duration:.2f} req/s")
    print(f"Success (200 OK): {len(successes)}")
    print(f"Errors: {len(errors)}")
    if other:
        print(f"Other statuses: {len(other)}")
        
    if times:
        print(f"Min response time: {min(times):.4f}s")
        print(f"Max response time: {max(times):.4f}s")
        print(f"Avg response time: {statistics.mean(times):.4f}s")
        if len(times) > 1:
            print(f"Median response time: {statistics.median(times):.4f}s")
    
    if errors:
        print("\nErrors encountered:")
        unique_errors = set([e["error"] for e in errors])
        for ue in unique_errors:
            print(f"- {ue}")
    print("="*30)

if __name__ == "__main__":
    run_stress_test()
