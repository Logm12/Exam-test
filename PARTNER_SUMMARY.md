# Tóm tắt thông tin Tài nguyên & Hạ tầng Server cho đối tác

Chào bạn, đây là bản tóm tắt các yêu cầu kỹ thuật của hệ thống **FDB TALENT Online Exam** để gửi cho bên đối tác:

### 1. Hệ điều hành & Công nghệ:
- **Server:** Linux Ubuntu 22.04 LTS (Khuyên dùng).
- **Công nghệ nền tảng:** Docker & Docker Compose (Hệ thống chạy hoàn toàn trên container để dễ quản lý).
- **Backend:** FastAPI (Python).
- **Frontend:** Next.js.
- **Dữ liệu:** PostgreSQL & Redis.

### 2. Cấu hình Server đề nghị:
- **CPU:** 4 Core.
- **RAM:** 8 GB.
- **SSD:** 50 GB.
- **IP:** 1 địa chỉ IP tĩnh (Public Static IP).

### 3. Yêu cầu chuẩn bị từ phía đối tác:
- Một máy chủ (VPS/Cloud) cài sẵn Ubuntu.
- Hai tên miền/subdomain (Ví dụ: `thi.tenmien.com` và `api.tenmien.com`).
- Chứng chỉ SSL (Sẽ cấu hình tự động khi triển khai).

### 4. Tài nguyên đã có:
- Mã nguồn đầy đủ (Backend, Frontend, Docker scripts).
- Tài liệu hướng dẫn cài đặt chi tiết (Deployment Guide).
- File cấu hình môi trường mẫu (.env blocks).

Bạn có thể gửi kèm file `SYSTEM_RESOURCES.md` để họ nắm chi tiết hơn nhé.
