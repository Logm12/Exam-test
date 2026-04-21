# Tài liệu dành cho Kỹ thuật viên (Đối tác) - Triển khai FDB TALENT

Hệ thống FDB TALENT được đóng gói bằng **Docker Compose**. Để triển khai nhanh chóng lên Server, quý đối tác vui lòng thực hiện các bước sau:

## 1. Vị trí mã nguồn
Toàn bộ mã nguồn nằm trong thư mục này. Các dịch vụ sẽ chạy trên các Port sau:
- **Frontend:** Port 3000
- **Backend API:** Port 8000
- **Database:** Port 5432
- **Redis:** Port 6379

## 2. Cấu hình Reverse Proxy (Nginx)
Trong thư mục `deployment/nginx/`, chúng tôi đã chuẩn bị sẵn 2 file cấu hình:
- `frontend.conf`: Cấu hình cho trang thi và portal sinh viên.
- `backend.conf`: Cấu hình cho API và Admin dashboard.

**Cách dùng:**
1. Sao chép 2 file này vào thư mục cấu hình Nginx trên server của quý đối tác (thường là `/etc/nginx/sites-available/` hoặc `/etc/nginx/conf.d/`).
2. Thay đổi `server_name` thành domain thực tế.
3. Kích hoạt cấu hình và restart Nginx.

## 3. Khởi chạy ứng dụng
Chạy lệnh sau tại thư mục gốc của dự án:
```bash
docker-compose up -d --build
```

## 4. Kiểm tra kết nối
Hệ thống yêu cầu Frontend phải gọi được đến API. Vui lòng đảm bảo các biến môi trường trong file `.env` hoặc `docker-compose.yml` đã được cập nhật đúng với Domain của quý đối tác.

---
Nếu có bất kỳ khó khăn nào trong quá trình điều hướng link hoặc cấu hình folder web, quý đối tác có thể phản hồi lại để chúng tôi hỗ trợ kịp thời.
