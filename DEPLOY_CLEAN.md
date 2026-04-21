# Hướng dẫn Triển khai "Sạch" lên Server VNUIS (User: vinhdq)

Tài liệu này hướng dẫn bạn cách đẩy code lên server mà không kèm theo các file rác/cache (`node_modules`, `__pycache__`, `.next`, v.v.) để đảm bảo server chạy ổn định.

### 1. Đẩy Code lên Server (Loại bỏ Cache)

Bạn hãy sử dụng lệnh **`rsync`** (nếu dùng Git Bash hoặc WSL trên Windows) hoặc dùng **`scp`** chọn lọc. 

**Lệnh đề xuất (Chạy từ PowerShell/Terminal trên máy bạn):**
```bash
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '__pycache__' --exclude '.venv' --exclude '.git' . vinhdq@112.137.143.139:/home/vinhdq/online-exam
```
*(Mật khẩu: `vinhdq`)*

---

### 2. Thiết lập trên Server (Dành cho User vinhdq)

Sau khi đẩy code xong, bạn SSH vào server: `ssh vinhdq@112.137.143.139` và chạy các bước sau:

**Bước A: Cấp quyền Docker cho user mới**
```bash
sudo usermod -aG docker vinhdq
newgrp docker
```

**Bước B: Khởi chạy ứng dụng**
```bash
cd /home/vinhdq/online-exam
docker-compose up -d --build
```

**Bước C: Cấu hình lại Nginx (Nếu chưa làm cho user cũ)**
```bash
sudo cp deployment/nginx/vnuis.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/vnuis.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### 3. Khởi tạo dữ liệu (Quan trọng)

Để app có giao diện và tính năng đầy đủ, bạn cần chạy lệnh tạo bảng và seed dữ liệu sau:
```bash
# Tạo bảng
docker exec -it online-exam-backend alembic upgrade head

# Tạo tài khoản admin mẫu (Username: admin, Pass: admin123)
docker exec -it online-exam-backend python seed_users.py
```

### Tại sao không đẩy cache?
- **node_modules:** Rất nặng (hàng trăm MB) và chứa các thư viện đã build cho Windows, không chạy được trên Linux. Docker sẽ tự cài lại bản chuẩn Linux khi bạn chạy lệnh `up --build`.
- **.next:** Chứa file build cũ của máy bạn, có thể gây lỗi hiển thị trên server.
- **__pycache__:** File rác của Python, làm nặng quá trình upload.

---
**Thông tin truy cập:**
- Domain: `http://fdbtalent.vnuis.edu.vn`
- User: `vinhdq` / Pass: `vinhdq`
