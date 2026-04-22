# Kế hoạch Triển Khai Xử Lý Lỗi 504 và Tính Năng Reset Bài Thi

Theo định hướng của các kỹ năng `concise-planning`, `kaizen`, và `brainstorming`, dưới đây là kế hoạch chi tiết từng bước để xử lý lỗi hệ thống và rà soát tính năng theo yêu cầu.

## 1. Phân Tích Hiện Trạng (Diagnosis)
- **Lỗi 504 Gateway Time-out:** Lỗi này xảy ra khi máy chủ Nginx (đóng vai trò là Reverse Proxy) không nhận được phản hồi từ container Frontend (Next.js) trong thời gian cho phép. Nguyên nhân phổ biến:
  - Container Frontend đang bị crash, treo, hoặc tràn bộ nhớ.
  - Vấn đề khi Next.js gọi Server-Side Rendering (SSR) tới Backend qua biến môi trường `INTERNAL_API_URL` bị time-out (Connection Refused).
- **Tính năng Xóa Record và Reset Lượt Bày:** Qua việc kiểm tra mã nguồn hiện tại, tính năng "Xóa & Reset" cho từng thí sinh **đã được thiết kế một phần** trên giao diện Admin (`/admin/exams/[id]/submissions`) và kết nối với Backend (`DELETE /{exam_id}/submissions/{user_id}`). Cần rà soát lại để chắc chắn hệ thống dọn dẹp sạch sẽ toàn bộ bản ghi (Submission, Answers, Session Redis) và xem xét code trên server có bị out-dated không.

## User Review Required

> [!IMPORTANT]
> Đây là thiết kế theo hướng "sửa lỗi tận gốc" và tuân thủ Kaizen (cải tiến liên tục nhưng an toàn). Trước khi tôi sử dụng kết nối SSH để chẩn đoán hệ thống thật trên máy chủ, mong bạn xác nhận kế hoạch dưới đây.

## Action Items (Kế hoạch hành động)

### Pha 1: Fix lỗi 504 Gateway Time-out (Ưu tiên)
- [ ] **Bước 1 (Gather logs):** SSH vào server `112.137.143.139` và trích xuất error log của `nginx` cùng log của container `online-exam-frontend`.
- [ ] **Bước 2 (Root cause analysis - /why):** Xác định lý do frontend bị tắc nghẽn. Nếu do vòng lặp API / network Docker, tiến hành cập nhật cấu hình `docker-compose.yml` hoặc `next.config.mjs` cho phù hợp.
- [ ] **Bước 3 (Apply Fix & Deploy):** Đồng bộ thay đổi và khởi động lại dịch vụ liên quan để web chạy lại trạng thái xanh (Green).

### Pha 2: Cải tiến & Đảm bảo tính năng Reset bài thi (Kaizen / Poka-Yoke)
- [ ] **Bước 4 (Review Code):** Đảm bảo tính năng Xoá bài thi (đã có trong mã nguồn local) hoạt động không để lại dữ liệu rác trên DB PostgreSQL và Redis.
- [ ] **Bước 5 (Enhancement):** Cải thiện giao diện hoặc bổ sung xử lý các corner cases (Ví dụ: thông báo xác nhận thành công, bảo vệ api chống spam reset). Nếu bạn đang muốn một chức năng reset nâng cao (ví dụ Reset hàng loạt), tôi sẽ cập nhật vào bước này.
- [ ] **Bước 6 (Push & Verify):** Triển khai đoạn code chức năng này lên server và thử nghiệm xoá 1 bản ghi thi làm mẫu.

## Open Questions

> [!WARNING]  
> Để tiếp tục, tôi có một số câu hỏi gửi đến bạn (theo quy trình Brainstorming):
> 1. Tính năng Xoá & Reset bài thi có sẵn 1 nút ở màn hình Admin bài thi hiện tại. Bạn muốn giữ nó như vậy, hay muốn bổ sung **Reset nhiều thí sinh cùng lúc**?
> 2. Tôi sẽ tạo một tool call SSH mới trong thiết bị để chủ động truyền trực tiếp User/Pass `vinhdq`, mong bạn cho phép để tôi có thể đọc log server và tìm ra nguồn gốc của mã lỗi 504.
> 3. Bạn có muốn tự tôi cập nhật mã nguồn (git pull/docker build) trên server khi tìm ra giải pháp, hay bạn sẽ tự làm việc đó?
