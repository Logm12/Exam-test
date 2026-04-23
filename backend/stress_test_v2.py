import asyncio
import httpx
import time
import statistics

# --- CONFIGURATION ---
TARGET_URL = "https://fdbtalent.vnuis.edu.vn/api/v1/health" # Test heavy API endpoint
CONCURRENT_USERS = 200
TOTAL_REQUESTS = 200 # Everyone hits at the exact same time
TIMEOUT = 30 # 30 seconds timeout to catch any slowdowns

async def make_request(client, user_id):
    start = time.time()
    try:
        response = await client.get(TARGET_URL, timeout=TIMEOUT)
        duration = time.time() - start
        return {"status": response.status_code, "time": duration}
    except Exception as e:
        return {"status": "ERROR", "time": time.time() - start, "error": str(e)}

async def run_stress_test():
    print("="*60)
    print(f"🚀 BAT DAU STRESS TEST V2 (200 CCU)")
    print(f"Target: {TARGET_URL}")
    print(f"Số lượng truy cập cùng lúc: {CONCURRENT_USERS}")
    print("="*60)
    print("\nĐang gửi yêu cầu (Vui lòng đợi)...")

    start_time = time.time()
    
    # Use HTTPX for high-concurrency async requests
    async with httpx.AsyncClient(limits=httpx.Limits(max_keepalive_connections=200, max_connections=200)) as client:
        tasks = [make_request(client, i) for i in range(CONCURRENT_USERS)]
        results = await asyncio.gather(*tasks)
            
    end_time = time.time()
    total_duration = end_time - start_time
    
    # Analysis
    successes = [r for r in results if r["status"] == 200]
    timeouts = [r for r in results if r["status"] == 504]
    errors = [r for r in results if r["status"] == "ERROR" or (isinstance(r["status"], int) and r["status"] >= 500 and r["status"] != 504)]
    
    times = [r["time"] for r in successes]
    
    print("\n" + "="*40)
    print("📊 KẾT QUẢ KIỂM TRA")
    print("="*40)
    print(f"Tổng thời gian thực hiện: {total_duration:.2f} giây")
    print(f"Tốc độ xử lý: {len(results)/total_duration:.2f} yêu cầu/giây")
    print(f"----------------------------------------")
    print(f"✅ Thành công (200 OK): {len(successes)}")
    print(f"❌ Lỗi 504 (Timeout):  {len(timeouts)}")
    print(f"⚠️ Lỗi khác (500/Err): {len(errors)}")
    print(f"----------------------------------------")
    
    if times:
        print(f"Phản hồi Nhanh nhất: {min(times):.4f}s")
        print(f"Phản hồi Chậm nhất:  {max(times):.4f}s")
        print(f"Phản hồi Trung bình: {statistics.mean(times):.4f}s")
    
    if len(timeouts) == 0 and len(errors) == 0:
        print("\n🏆 KẾT LUẬN: TUYỆT VỜI! Hệ thống đã vượt qua bài test 200 CCU mà không có lỗi 504.")
    elif len(timeouts) > 0:
        print(f"\n🔴 CẢNH BÁO: Vẫn còn {len(timeouts)} kết nối bị 504. Cần kiểm tra cấu hình Nginx hoặc DB Pool.")
    else:
        print("\n🟠 CHÚ Ý: Có lỗi xảy ra nhưng không phải 504. Hãy kiểm tra logs.")
    print("="*40)

if __name__ == "__main__":
    try:
        asyncio.run(run_stress_test())
    except KeyboardInterrupt:
        pass
