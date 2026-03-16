# 📢 HỆ THỐNG THI TRỰC TUYẾN - THÔNG BÁO CẬP NHẬT (UPDATE LOG)

## [v1.6.0] - Critical System Stabilization (16/03/2026)

### 🇻🇳 Tiếng Việt:
Bản cập nhật này tập trung vào việc sửa các lỗi nghiêm trọng trong quá trình tạo và quản lý bài thi của Quản trị viên, đồng thời tối ưu hóa quy trình khởi động hệ thống.

*   **Sửa lỗi SQL (Ảnh bìa):** Đã kích hoạt cơ chế migration mới nhất, giải quyết triệt để lỗi không lưu được ảnh bìa bài thi vào cơ sở dữ liệu.
*   **Sửa lỗi Tạo/Sửa bài thi:** Khắc phục lỗi "Validation Error (422)" khi Admin thực hiện cập nhật trạng thái hoặc chỉnh sửa bài thi. Hiện tại, các trường dữ liệu tùy chọn không còn gây lỗi hệ thống.
*   **Trình khởi động Start.bat:** Thêm file `start.bat` tại thư mục gốc, cho phép bật toàn bộ hệ thống (Docker, Frontend, Backend) chỉ với một cú click chuột.
*   **Cập nhật giao diện:** Hiển thị preview ảnh bìa chính xác dựa trên cấu hình môi trường thực tế.

### 🇺🇸 English:
This update focuses on resolving critical bugs within the Admin exam creation and management flows while optimizing system startup procedures.

*   **SQL Fix (Cover Image):** Activated the latest database migrations to resolve persistence issues related to the `cover_image` column.
*   **Creation/Edit Workflow Fix:** Resolved "Validation Error (422)" caused by strict schema enforcement. Optional fields (like cover images or specific start times) no longer block system updates.
*   **System Launcher:** Introduced `start.bat` in the root directory, enabling one-click startup for Docker, Frontend, and Backend services.
*   **UI Optimization:** Fixed hardcoded preview URLs for exam cover images, ensuring they follow environment-specific API configurations.

---
(Phiên bản mới)

Tài liệu này tổng hợp toàn bộ các lỗi đã được khắc phục và các thay đổi về giao diện (UI) gần đây trên hệ thống FDB TALENT để team nắm bắt thông tin đồng bộ.

---

## 🔒 1. Backend & Database (Bảo mật & Fix Lỗi Logic)

### Vá Lỗ Hổng Authentication (Nghiêm trọng)
*   **Vấn đề:** Các API quản trị (`/exams`, `/questions`, `/users`, `/pools`, `/organizations`) trước đây bị lộ, bất kỳ ai có token hợp lệ (kể cả sinh viên) đều có thể gọi để xem/sửa dữ liệu.
*   **Cách giải quyết:** Đã xây dựng hàm bảo vệ `get_current_active_admin`. Hiện tại, MỌI hành động tạo, sửa, xóa đều bị kiểm tra nghiêm ngặt, ép buộc tài khoản gọi API phải có role `admin`. Nếu sinh viên cố tình truy cập sẽ bị chặn (HTTP 403 Forbidden).

### Sửa Lỗi Tính Điểm Khống (False Positive)
*   **Vấn đề:** Hệ thống trước đây có lỗ hổng chấm điểm lỏng lẻo. Sinh viên không làm bài (gửi giấy trắng `""` hoặc `null`) vẫn có tình trạng được vớt điểm hoặc hệ thống không ghi nhận sai chính xác.
*   **Cách giải quyết:** Áp dụng thuật toán Strict Validation. Cả đáp án của Sinh Viên và Đáp án mốc đều được đối chiếu một cách loại trừ khoảng trắng dư thừa `str(ans_value).strip() == str(q.correct_answer).strip()`. Bỏ qua hoàn toàn các giá trị None/Rỗng, đảm bảo tính công bằng tuyệt đối.

### Sửa Bug Chống Spam API & Duplicate Answers
*   **Vấn đề:** Khi mạng yếu, thí sinh bấm Nộp Bài nhiều lần sẽ khiến Backend đẻ ra hàng loạt bản ghi trùng lặp (Duplicate Answer) trong CSDL khiến việc rà soát log gian lận bị nhiễu loạn.
*   **Cách giải quyết:** 
    *   Bật lại hệ thống Rate Limiting bằng Redis để chống Spam Request.
    *   Thêm quy trình "Dọn Rác": tự động xóa sạch các answer nháp cũ của trạng thái `in_progress` trước khi lưu vào trạng thái `submitted`.
    *   Gia cố DB bằng `UniqueConstraint('submission_id', 'question_id')` cấm tuyệt đối 1 câu hỏi có tới 2 đáp án cho 1 lần nộp bài.

### Môi trường & Ổn định máy chủ
*   **Dependencies:** Nâng cấp và khóa cứng version các thư viện xung đột (FastAPI 0.115). Thay thế `@app.on_event` báo obsolete thành `lifespan`.

---

## 🎨 2. Frontend & UI Redesign (Nhận Diện Thương Hiệu VNU-IS)

### Thay đổi Tên & Slogan
*   **Đổi tên:** Thay thế toàn bộ chữ "ExamOS" cứng ngắc thành tên mới chuyên nghiệp hơn: **FDB TALENT**.
*   **Slogan mới:** Áp dụng và cho hiển thị câu *"1 sản phẩm đến từ Liên chi đoàn Khoa Các Khoa học Ứng dụng"* trên trang chủ phần Hero Banner và màn hình đăng nhập Admin.

### Nâng Cấp Giao Diện (Theme VNU-IS)
Team đã thống nhất loại bỏ gam màu Xanh nhạt (Cyan) tĩnh cũ, và **đã chính thức khoác lên mình hệ màu nhận diện quy chuẩn của VNU-IS (Khoa Quốc Tế)**:
*   Màu chủ đạo (Primary): **Xanh Navy (Navy Blue - `#1e3a8a`)** được áp dụng cho toàn bộ nút bấm chính, Topbar, Sidebar và typography.
*   Màu điểm nhấn (Accent): **Vàng Đồng/Cam nhạt (Gold/Yellow - `#f59e0b`)** được ứng dụng làm hiệu ứng ánh sáng, viền Card, và nhãn Badge.
*   **Đồng Bộ View:** Từ màn hình của Admin, Login cho tới Landing page đều tuân thủ nguyên tắc không sử dụng nền đen, hạn chế Dark Mode để giao diện luôn thanh thoát, sạch sẽ và sáng sủa nhất.

### Tối Ưu Hóa Ngôn Ngữ (Bilingual)
*   **Tính Năng:** Đã fix hoàn chỉnh nút Toggle Ngôn Ngữ. Backend và Frontend giờ đây thay đổi Text mượt mà giữa "Tiếng Anh" và "Tiếng Việt" mà không bị crash hay hiển thị sai màu. Nút Toggle màu Navy tinh tế.
*   Đồng bộ toàn bộ file `translations.ts` với Brand mới.

---
**🚀 Lưu ý cho Team:** Code hiện tại đã là bản ổn định (Stable). Các bạn có thể `git pull` nhánh mới nhất về để Review và bắt đầu Testing các tính năng Quản lý Đề thi nhé.
