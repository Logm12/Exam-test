# Tài liệu Tài nguyên Hệ thống & Hạ tầng Server - FDB TALENT

Tài liệu này cung cấp các yêu cầu kỹ thuật chi tiết về phần cứng và phần mềm cần thiết để triển khai nền tảng **FDB TALENT Online Exam**.

## 1. Hệ điều hành khai thác (Operating System)

| Môi trường | Lựa chọn Đề nghị | Ghi chú |
| :--- | :--- | :--- |
| **Sản xuất (Production)** | **Ubuntu 22.04 LTS** trở lên | Ưu tiên Linux để tối ưu hiệu năng và bảo mật cho server. |
| **Thử nghiệm/Phát triển** | Windows 10/11 hoặc macOS | Cần cài đặt Docker Desktop để chạy môi trường giả lập. |

## 2. Yêu cầu Cấu hình Phần cứng (Hardware Requirements)

Cấu hình đề nghị cho việc phục vụ khoảng 500-1000 thí sinh truy cập đồng thời.

| Thông số | Cấu hình Tối thiểu | Cấu hình Đề nghị (Khuyên dùng) |
| :--- | :--- | :--- |
| **CPU** | 2 vCPU | 4 vCPU |
| **RAM** | 4 GB | 8 GB |
| **Bộ nhớ (SSD)** | 20 GB | 50 GB+ |
| **Băng thông** | 100 Mbps | 1 Gbps |

## 3. Danh mục Công nghệ (Tech Stack)

| Thành phần | Lựa chọn Công nghệ |
| :--- | :--- |
| **Backend** | Python 3.12, FastAPI (Async Framework) |
| **Frontend** | Next.js 16, React, TailwindCSS |
| **Cơ sở dữ liệu** | PostgreSQL 15+ |
| **Bộ nhớ đệm/Queue** | Redis 6+ (Dùng cho Rate Limiting & Ghi nháp tự động) |
| **Containerization** | Docker, Docker Compose |

## 4. Các tài nguyên cần bàn giao/chuẩn bị

Để gửi cho đối tác triển khai, cần chuẩn bị các thông tin sau:
1. **Môi trường Server:** VPS chạy Ubuntu (có quyền root).
2. **Cấu hình Domain:** Đã trỏ A record về IP của Server (cho cả App và API).
3. **Cơ sở hạ tầng:** Đã cài đặt Docker và Docker Compose phiên bản mới nhất.
4. **Tài nguyên Media:** Logo tổ chức, ảnh poster truyền thông cho cuộc thi.

---
*Tài liệu được biên soạn phục vụ công tác bàn giao kỹ thuật cho đối tác.*
