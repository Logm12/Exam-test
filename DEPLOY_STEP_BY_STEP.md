# Hướng dẫn Triển khai Hệ thống FDB TALENT lên Server có Domain

Vì bạn đã có Domain và Server cực mạnh, dưới đây là 5 bước để "đẩy" hệ thống lên chạy chính thức:

### Bước 1: Đưa Code lên Server
- **Cách 1 (Khuyên dùng):** Đẩy code lên GitHub/GitLab, sau đó vào Server thực hiện `git clone`.
- **Cách 2:** Nén thư mục `online-exam` lại và dùng phần mềm WinSCP hoặc FileZilla để upload lên Server.

### Bước 2: Cài đặt Docker trên Server
Nếu Server chưa có Docker, hãy chạy các lệnh sau (Dành cho Ubuntu):
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
```

### Bước 3: Cấu hình Tên miền (Domain)
Mở file `docker-compose.yml` trên Server và chỉnh lại các dòng sau cho đúng tên miền của bạn:
- `NEXT_PUBLIC_API_URL`: Thay bằng `https://api.yourdomain.com/api/v1`
- `NEXTAUTH_URL`: Thay bằng `https://thi.yourdomain.com`

### Bước 4: Khởi chạy hệ thống
Tại thư mục gốc (`online-exam`), chạy lệnh:
```bash
docker-compose up -d --build
```
Lệnh này sẽ tự động:
1. Tạo Database (Postgres) và Caching (Redis).
2. Build và chạy Backend Python.
3. Build và chạy Frontend Next.js.

### Bước 5: Cấu hình Nginx (Để chạy với HTTPS và Port 80/443)
Vì hệ thống đang chạy ở Port 3000 và 8000, bạn cần Nginx để điều hướng từ Domain vào các Port này.

**Mẫu cấu hình Nginx cho Frontend (`thi.yourdomain.com`):**
```nginx
server {
    server_name thi.yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

**Mẫu cấu hình Nginx cho Backend (`api.yourdomain.com`):**
```nginx
server {
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }
}
```

---
**Lưu ý Cuối cùng:** Sau khi chạy Docker lần đầu, bạn cần chạy lệnh này để tạo bảng dữ liệu (Database Migration):
```bash
docker exec -it online-exam-backend alembic upgrade head
```

Tôi đã chuẩn bị sẵn **Dockerfile cho Frontend** và cập nhật lại file **docker-compose.yml** cho bạn rồi. Bạn chỉ cần thực hiện theo các bước trên nhé!
