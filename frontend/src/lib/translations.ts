export type Locale = "vi" | "en";

const translations: Record<string, Record<Locale, string>> = {
    // Chung
    "app.name": { vi: "FDB TALENT", en: "FDB TALENT" },
    "app.signOut": { vi: "Thoát", en: "Sign out" },
    "app.signIn": { vi: "Đăng nhập", en: "Sign in" },
    "app.register": { vi: "Đăng ký", en: "Register" },
    "app.processing": { vi: "Đang xử lý...", en: "Processing..." },
    "app.language": { vi: "EN", en: "VI" },

    // Trang chủ
    "landing.hero.title": { vi: "Cổng đánh giá năng lực FDB TALENT", en: "FDB TALENT Assessment Portal" },
    "landing.hero.subtitle": { vi: "1 sản phẩm đến từ Liên chi đoàn Khoa Các Khoa học Ứng dụng", en: "A product from the Inter-branch Youth Union of the Faculty of Applied Sciences" },
    "landing.badge": { vi: "Chống gian lận | Giám sát thời gian thực", en: "Anti-Cheating | Real-time Monitoring" },
    "landing.cta.student": { vi: "Đăng nhập làm bài", en: "Student Login" },
    "landing.cta.admin": { vi: "Quản trị viên", en: "Admin Login" },
    "landing.features.antiCheat": { vi: "Chống gian lận", en: "Anti-Cheating" },
    "landing.features.antiCheatDesc": { vi: "Giám sát chuyển tab, chặn copy/paste, tự động nộp bài khi vi phạm", en: "Tab monitoring, copy/paste blocking, auto-submit on violation" },
    "landing.features.realtime": { vi: "Thời gian thực", en: "Real-time" },
    "landing.features.realtimeDesc": { vi: "Theo dõi tiến trình thi và kết quả ngay lập tức", en: "Track exam progress and results instantly" },
    "landing.features.multiFormat": { vi: "Đa định dạng", en: "Multi-format" },
    "landing.features.multiFormatDesc": { vi: "Hỗ trợ trắc nghiệm, tự luận ngắn, và nhiều dạng câu hỏi khác", en: "Supports MCQ, short answer, and various question types" },

    // Bảng điều khiển sinh viên
    "student.dashboard.title": { vi: "Bài kiểm tra của tôi", en: "My Assessments" },
    "student.dashboard.subtitle": { vi: "Xem và bắt đầu các bài kiểm tra được chỉ định. Hãy đảm bảo bạn ở trong môi trường yên tĩnh trước khi bắt đầu.", en: "View and start your assigned exams. Make sure you are in a quiet environment before starting." },
    "student.dashboard.available": { vi: "Đang mở", en: "Available Now" },
    "student.dashboard.begin": { vi: "Bắt đầu làm bài", en: "Begin Assessment" },
    "student.dashboard.noExams": { vi: "Bạn đã hoàn thành tất cả!", en: "All caught up!" },
    "student.dashboard.noExamsDesc": { vi: "Hiện tại không có bài kiểm tra nào được chỉ định cho tài khoản của bạn.", en: "No active exams assigned to your account at the moment." },
    "student.antiCheat.title": { vi: "Biện pháp chống gian lận đã bật", en: "Anti-Cheating Measures Active" },
    "student.antiCheat.desc": { vi: "Bài thi yêu cầu chế độ toàn màn hình. Chuyển tab, mở tab mới, hoặc copy/paste sẽ bị ghi nhận và có thể vô hiệu hóa bài thi của bạn.", en: "Exams run in fullscreen. Switching tabs, opening new ones, or using copy/paste will be recorded and may void your attempt." },
    "student.duration": { vi: "Phút", en: "Min" },
    "student.starts": { vi: "Bắt đầu:", en: "Starts:" },

    // Đăng ký sinh viên
    "register.title": { vi: "Tạo tài khoản mới", en: "Create an account" },
    "register.subtitle": { vi: "Đăng ký tài khoản hệ thống FDB TALENT", en: "Register an account on FDB TALENT" },
    "register.confirmPassword": { vi: "Xác nhận mật khẩu", en: "Confirm Password" },
    "register.hasAccount": { vi: "Đã có tài khoản?", en: "Already have an account?" },
    "register.success": { vi: "Tạo tài khoản thành công!", en: "Account created successfully!" },
    "register.redirecting": { vi: "Đang chuyển hướng đến trang đăng nhập...", en: "Redirecting to login..." },
    "register.error.passwordMismatch": { vi: "Mật khẩu xác nhận không khớp.", en: "Passwords do not match." },

    // Đăng nhập sinh viên
    "login.title": { vi: "Cổng thí sinh FDB TALENT", en: "FDB TALENT Student Portal" },
    "login.subtitle": { vi: "Hệ thống thi trắc nghiệm trực tuyến", en: "Online examination system" },
    "login.username": { vi: "Tên đăng nhập", en: "Username" },
    "login.password": { vi: "Mật khẩu", en: "Password" },
    "login.error.invalid": { vi: "Tên đăng nhập hoặc mật khẩu không chính xác.", en: "Incorrect username or password." },
    "login.error.accessDenied": { vi: "Bạn không có quyền truy cập trang đó.", en: "You don't have permission to access that page." },
    "login.error.failed": { vi: "Lỗi xác thực", en: "Authentication failed" },
    "login.noAccount": { vi: "Chưa có tài khoản?", en: "Don't have an account?" },
    "login.switchRegister": { vi: "Đăng ký ngay", en: "Register now" },
    "login.orContinue": { vi: "Hoặc tiếp tục với", en: "Or continue with" },

    // Đăng nhập quản trị
    "admin.login.title": { vi: "FDB TALENT Quản trị", en: "FDB TALENT Admin" },
    "admin.login.subtitle": { vi: "1 sản phẩm đến từ Liên chi đoàn Khoa Các Khoa học Ứng dụng", en: "A product from the Inter-branch Youth Union of the Faculty of Applied Sciences" },
    "admin.login.username": { vi: "Tài khoản Quản trị", en: "Admin Account" },
    "admin.login.password": { vi: "Mật khẩu", en: "Password" },
    "admin.login.submit": { vi: "Đăng nhập truy cập hệ thống", en: "Sign in to access system" },
    "admin.login.error.access": { vi: "Bạn không có quyền truy cập trang quản trị.", en: "You don't have admin access." },
    "admin.login.error.invalid": { vi: "Tài khoản hoặc mật khẩu không chính xác.", en: "Incorrect username or password." },
    "admin.login.error.system": { vi: "Lỗi hệ thống", en: "System error" },
    "admin.login.noAccount": { vi: "Không có quyền quản trị?", en: "No admin privileges?" },
    "admin.login.switchRegister": { vi: "Đăng ký quyền quản trị", en: "Register as Admin" },

    // Đăng ký quản trị
    "admin.register.title": { vi: "Tạo tài khoản Quản trị", en: "Create Admin Account" },
    "admin.register.subtitle": { vi: "Cấp quyền quản trị viên mới", en: "Provision a new admin account" },
    "admin.register.submit": { vi: "Tạo tài khoản Quản trị", en: "Create Admin" },
    "admin.register.confirmPassword": { vi: "Xác nhận mật khẩu", en: "Confirm Password" },
    "admin.register.hasAccount": { vi: "Bạn đã là quản trị viên?", en: "Already an admin?" },
    "admin.register.switchLogin": { vi: "Đăng nhập ngay", en: "Log in now" },
    "admin.register.success": { vi: "Đã tạo tài khoản quản trị!", en: "Admin account created!" },

    // Bảng điều khiển quản trị
    "admin.portal": { vi: "Cổng Quản trị", en: "Admin Portal" },
    "admin.dashboard.title": { vi: "Trung tâm điều khiển FDB TALENT", en: "FDB TALENT Control Panel" },
    "admin.dashboard.subtitle": { vi: "1 sản phẩm đến từ Liên chi đoàn Khoa Các Khoa học Ứng dụng", en: "A product from the Inter-branch Youth Union of the Faculty of Applied Sciences" },
    "admin.dashboard.createExam": { vi: "+ Tạo bài thi mới", en: "+ Create New Exam" },
    "admin.dashboard.totalExams": { vi: "Tổng bài thi", en: "Total Submissions" },
    "admin.dashboard.avgScore": { vi: "Điểm trung bình", en: "Average Score" },
    "admin.dashboard.accuracy": { vi: "Tỷ lệ chính xác", en: "Accuracy Rate" },
    "admin.dashboard.cheatingAlerts": { vi: "Cảnh báo gian lận", en: "Cheating Alerts" },
    "admin.dashboard.violations": { vi: "Giám sát vi phạm (Nộp bài tự động)", en: "Violation Monitor (Auto-Submit Logs)" },
    "admin.dashboard.live": { vi: "Trực tiếp", en: "Live" },
    "admin.dashboard.noViolations": { vi: "Hệ thống an toàn. Không phát hiện vi phạm.", en: "System secure. No violations detected." },
    "admin.dashboard.autoSubmit": { vi: "Bị thu bài tự động", en: "Auto-submitted" },
    "admin.dashboard.violations.count": { vi: "lần vi phạm", en: "violations" },
    "admin.dashboard.tabSwitch": { vi: "Chuyển tab / Mất focus", en: "Tab switch / Lost focus" },
    "admin.dashboard.times": { vi: "lần", en: "times" },
    "admin.dashboard.recentExams": { vi: "Bài thi gần đây", en: "Recent Exams" },
    "admin.dashboard.examTitle": { vi: "Tên bài thi", en: "Exam Title" },
    "admin.dashboard.duration": { vi: "Thời lượng", en: "Duration" },
    "admin.dashboard.status": { vi: "Trạng thái", en: "Status" },
    "admin.dashboard.published": { vi: "Đã xuất bản", en: "Published" },
    "admin.dashboard.draft": { vi: "Nháp", en: "Draft" },
    "admin.dashboard.minutes": { vi: "phút", en: "min" },

    // Thanh bên quản trị
    "admin.sidebar.dashboard": { vi: "Bảng điều khiển", en: "Dashboard" },
    "admin.sidebar.exams": { vi: "Bộ sưu tập đề thi", en: "Exams Collection" },
    "admin.sidebar.students": { vi: "Thí sinh", en: "Students" },
    "admin.sidebar.settings": { vi: "Cài đặt hệ thống", en: "System Settings" },
    "admin.sidebar.logout": { vi: "Đăng xuất", en: "Logout" },

    // Exam gateway
    "exam.gateway.header": { vi: "Cổng bài thi ExamOS", en: "ExamOS Exam Gateway" },
    "exam.gateway.backDashboard": { vi: "Quay lại", en: "Back" },
    "exam.gateway.status": { vi: "Trạng thái: Sẵn sàng", en: "Status: Ready" },
    "exam.gateway.minutes": { vi: "Phút", en: "Minutes" },
    "exam.gateway.briefing": { vi: "Lưu ý trước khi thi", en: "Before You Start" },
    "exam.gateway.continuous": { vi: "Thi liên tục", en: "Continuous Assessment" },
    "exam.gateway.continuousDesc": { vi: "Khi bắt đầu, đồng hồ không thể tạm dừng. Hãy đảm bảo kết nối mạng ổn định.", en: "Once started, the timer cannot be paused. Make sure you have a stable connection." },
    "exam.gateway.antiCheat": { vi: "Chống gian lận đã bật", en: "Anti-Cheating Enabled" },
    "exam.gateway.antiCheatDesc": { vi: "Bài thi sẽ chạy ở chế độ toàn màn hình. Chuyển tab hoặc ứng dụng sẽ bị ghi nhận.", en: "This assessment will run in fullscreen mode. Switching tabs or applications will be logged." },
    "exam.gateway.autoSubmit": { vi: "Tự động nộp bài", en: "Auto-Submission" },
    "exam.gateway.autoSubmitDesc": { vi: "Bài làm được lưu định kỳ. Bài thi sẽ tự động nộp khi hết thời gian.", en: "Your answers are saved periodically. The exam will auto-submit when the duration expires." },
    "exam.gateway.startBtn": { vi: "Tôi đã hiểu, bắt đầu làm bài", en: "I Understand, Start Assessment" },
    "exam.gateway.agreement": { vi: "Khi bắt đầu, bạn đồng ý với các quy định về liêm chính học thuật của tổ chức.", en: "By starting, you agree to the academic integrity policies set by your organization." },
    "exam.gateway.unavailable": { vi: "Bài thi không khả dụng", en: "Assessment Unavailable" },
    "exam.gateway.unavailableDesc": { vi: "Bài thi chưa được xuất bản, không tồn tại, hoặc bạn không có quyền truy cập.", en: "This exam is either not published, does not exist, or you do not have permission to access it." },
    "exam.gateway.returnDashboard": { vi: "Quay lại trang chủ", en: "Return to Dashboard" },

    // Exam take
    "exam.take.warning": { vi: "Cảnh báo vi phạm", en: "Integrity Warning" },
    "exam.take.warnings": { vi: "Cảnh báo vi phạm", en: "Integrity Warnings" },
    "exam.take.finishExam": { vi: "Nộp bài", en: "Finish Exam" },
    "exam.take.submitting": { vi: "Đang nộp...", en: "Submitting..." },
    "exam.take.submitSuccess": { vi: "Nộp bài thành công!", en: "Submission successful!" },
    "exam.take.confirmSubmit": { vi: "Bạn có chắc chắn muốn nộp bài sớm? Hành động này không thể hoàn tác.", en: "Are you sure you want to finalize and submit early? You cannot undo this." },
    "exam.take.typeAnswer": { vi: "Nhập câu trả lời...", en: "Type your answer here..." },
    "exam.take.characters": { vi: "ký tự", en: "characters" },
    "exam.take.noQuestions": { vi: "Không tìm thấy câu hỏi cho bài thi này.", en: "No questions found for this exam." },
    "exam.take.submitFailed": { vi: "Nộp bài thất bại. Vui lòng kiểm tra kết nối mạng.", en: "Submission failed. Please check your network connection." },
    "exam.take.alreadySubmitted": { vi: "Bài thi này đã được nộp rồi. Bạn không thể nộp lại.", en: "This exam has already been submitted. You cannot submit again." },

    // Receipt
    "exam.receipt.title": { vi: "Đã nhận bài làm", en: "Submission Received" },
    "exam.receipt.desc": { vi: "Bài làm của bạn đã được ghi nhận thành công.", en: "Your assessment has been successfully recorded." },
    "exam.receipt.timestamp": { vi: "Thời gian nộp", en: "Timestamp" },
    "exam.receipt.returnDashboard": { vi: "Quay lại trang chủ", en: "Return to Dashboard" },

    // Exam landing (per-exam public page)
    "exam.landing.rules": { vi: "Quy định khi thi", en: "Exam Rules" },
    "exam.landing.rule1": { vi: "Bài thi chạy chế độ toàn màn hình. Chuyển tab sẽ bị ghi nhận và cảnh báo.", en: "The exam runs in fullscreen mode. Tab switching will be logged and warned." },
    "exam.landing.rule2": { vi: "Chuyển tab quá 3 lần sẽ bị nộp bài tự động và kết thúc bài thi.", en: "Switching tabs more than 3 times will auto-submit and end your exam." },
    "exam.landing.rule3": { vi: "Đồng hồ đếm ngược không thể tạm dừng. Đảm bảo kết nối mạng ổn định.", en: "The countdown timer cannot be paused. Ensure a stable internet connection." },

    // Anti-cheat warnings
    "anticheat.warning.title": { vi: "Cảnh báo!", en: "Warning!" },
    "anticheat.warning.tabswitch": { vi: "Bạn đã chuyển tab. Đây là lần thứ {count}/3. Chuyển tab thêm {remaining} lần sẽ tự động nộp bài.", en: "You switched tabs. This is violation {count}/3. {remaining} more will auto-submit." },
    "anticheat.warning.autosubmit": { vi: "Bạn đã vi phạm quá 3 lần. Bài thi đã được nộp tự động.", en: "You exceeded 3 violations. Your exam has been auto-submitted." },
    "anticheat.warning.understood": { vi: "Đã hiểu", en: "Understood" },

    // Import questions
    "import.title": { vi: "Nhập đề từ file", en: "Import from File" },
    "import.description": { vi: "Tải lên file Word (.doc/.docx) hoặc PDF để tự động trích xuất câu hỏi.", en: "Upload a Word (.doc/.docx) or PDF file to auto-extract questions." },
    "import.dropzone": { vi: "Kéo thả file vào đây hoặc bấm để chọn", en: "Drag and drop a file here, or click to select" },
    "import.maxSize": { vi: "Tối đa 10MB, định dạng .doc/.docx hoặc .pdf", en: "Max 10MB, .doc/.docx or .pdf format" },
    "import.processing": { vi: "Đang xử lý file...", en: "Processing file..." },
    "import.found": { vi: "Tìm thấy {count} câu hỏi", en: "Found {count} questions" },
    "import.addSelected": { vi: "Thêm câu hỏi đã chọn", en: "Add Selected Questions" },
    "import.error": { vi: "Không thể đọc file. Vui lòng kiểm tra định dạng.", en: "Cannot read file. Please check the format." },

    // Quản lý đề thi (Admin)
    "admin.exams.title": { vi: "Bộ sưu tập đề thi", en: "Exams Collection" },
    "admin.exams.subtitle": { vi: "Quản lý tất cả các bài kiểm tra trong hệ thống.", en: "Manage all examinations in the system." },
    "admin.exams.createNew": { vi: "Tạo bài thi mới", en: "Create New Exam" },
    "admin.exams.noExams": { vi: "Chưa có bài thi nào", en: "No exams yet" },
    "admin.exams.createFirst": { vi: "Tạo bài thi đầu tiên", en: "Create the first exam" },
    "admin.exams.table.title": { vi: "Tiêu đề", en: "Title" },
    "admin.exams.table.duration": { vi: "Thời lượng", en: "Duration" },
    "admin.exams.table.status": { vi: "Trạng thái", en: "Status" },
    "admin.exams.table.startTime": { vi: "Thời gian bắt đầu", en: "Start Time" },
    "admin.exams.table.actions": { vi: "Thao tác", en: "Actions" },
    "admin.exams.confirmDelete": { vi: "Bạn có chắc chắn muốn xóa bài thi này?", en: "Are you sure you want to delete this exam?" },
    "admin.exams.delete": { vi: "Xóa", en: "Delete" },
    "admin.exams.edit": { vi: "Sửa", en: "Edit" },
    "admin.exams.published": { vi: "Đã xuất bản", en: "Published" },
    "admin.exams.draft": { vi: "Nháp", en: "Draft" },

    // Tạo đề thi mới
    "admin.exams.new.title": { vi: "Tạo bài thi mới", en: "Create New Exam" },
    "admin.exams.new.subtitle": { vi: "Cấu hình chi tiết bài thi và xây dựng ngân hàng câu hỏi.", en: "Configure exam details and build your question bank." },
    "admin.exams.new.details": { vi: "Thông tin cơ bản", en: "Exam Details" },
    "admin.exams.new.examTitle": { vi: "Tiêu đề bài thi", en: "Exam Title" },
    "admin.exams.new.duration": { vi: "Thời lượng (Phút)", en: "Duration (Minutes)" },
    "admin.exams.new.questionsBank": { vi: "Ngân hàng câu hỏi", en: "Questions Bank" },
    "admin.exams.new.addQuestion": { vi: "+ Thêm câu hỏi", en: "+ Add Question" },
    "admin.exams.new.multipleChoice": { vi: "Trắc nghiệm", en: "Multiple Choice" },
    "admin.exams.new.shortAnswer": { vi: "Tự luận ngắn", en: "Short Answer" },
    "admin.exams.new.questionContent": { vi: "Nội dung câu hỏi...", en: "Question content..." },
    "admin.exams.new.option": { vi: "Đáp án", en: "Option" },
    "admin.exams.new.expectedAnswer": { vi: "Đáp án mong đợi (sẽ được chấm thủ công nếu không khớp)", en: "Expected correct answer (will be manually graded if not matched)" },
    "admin.exams.new.noQuestions": { vi: "Chưa có câu hỏi nào", en: "No questions yet" },
    "admin.exams.new.addFirst": { vi: "Thêm câu hỏi đầu tiên", en: "Add the first question" },
    "admin.exams.new.publishing": { vi: "Đang xuất bản...", en: "Publishing..." },
    "admin.exams.new.publish": { vi: "Xuất bản bài thi", en: "Publish Exam" },
    "admin.exams.new.failed": { vi: "Tạo bài thi thất bại", en: "Failed to create exam" },
};

export function t(key: string, locale: Locale): string {
    return translations[key]?.[locale] ?? key;
}

export default translations;
