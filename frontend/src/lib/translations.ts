export type Locale = "vi" | "en";

const translations: Record<string, Record<Locale, string>> = {
    // Chung
    "app.name": { vi: "ExamOS", en: "ExamOS" },
    "app.signOut": { vi: "Thoát", en: "Sign out" },
    "app.signIn": { vi: "Đăng nhập", en: "Sign in" },
    "app.register": { vi: "Đăng ký", en: "Register" },
    "app.processing": { vi: "Đang xử lý...", en: "Processing..." },
    "app.language": { vi: "EN", en: "VI" },

    // Trang chủ
    "landing.hero.title": { vi: "Hệ thống thi trắc nghiệm trực tuyến", en: "Online Examination Platform" },
    "landing.hero.subtitle": { vi: "Nền tảng tổ chức thi trực tuyến chuyên nghiệp, chống gian lận, hỗ trợ nhiều định dạng câu hỏi", en: "Professional online exam platform with anti-cheating and multi-format question support" },
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

    // Đăng nhập sinh viên
    "login.title": { vi: "Cổng thí sinh ExamOS", en: "ExamOS Student Portal" },
    "login.subtitle": { vi: "Hệ thống thi trắc nghiệm trực tuyến", en: "Online examination system" },
    "login.username": { vi: "Tên đăng nhập", en: "Username" },
    "login.password": { vi: "Mật khẩu", en: "Password" },
    "login.error.invalid": { vi: "Tên đăng nhập hoặc mật khẩu không chính xác.", en: "Incorrect username or password." },
    "login.error.accessDenied": { vi: "Bạn không có quyền truy cập trang đó.", en: "You don't have permission to access that page." },
    "login.error.failed": { vi: "Lỗi xác thực", en: "Authentication failed" },
    "login.switchRegister": { vi: "Chưa có tài khoản? Đăng ký", en: "Need an account? Register" },
    "login.switchLogin": { vi: "Đã có tài khoản? Đăng nhập", en: "Already have an account? Sign in" },
    "login.orContinue": { vi: "Hoặc đăng nhập bằng", en: "Or continue with" },

    // Đăng nhập quản trị
    "admin.login.title": { vi: "ExamOS Quản trị", en: "ExamOS Admin" },
    "admin.login.subtitle": { vi: "Hệ thống Quản trị thi trực tuyến", en: "Exam management system" },
    "admin.login.username": { vi: "Tài khoản Quản trị", en: "Admin Account" },
    "admin.login.password": { vi: "Mật khẩu", en: "Password" },
    "admin.login.submit": { vi: "Đăng nhập truy cập hệ thống", en: "Sign in to access system" },
    "admin.login.error.access": { vi: "Bạn không có quyền truy cập trang quản trị.", en: "You don't have admin access." },
    "admin.login.error.invalid": { vi: "Tài khoản hoặc mật khẩu không chính xác.", en: "Incorrect username or password." },
    "admin.login.error.system": { vi: "Lỗi đăng nhập hệ thống", en: "System login error" },

    // Bảng điều khiển quản trị
    "admin.portal": { vi: "Cổng Quản trị", en: "Admin Portal" },
    "admin.dashboard.title": { vi: "Trung tâm điều khiển ExamOS", en: "ExamOS Control Panel" },
    "admin.dashboard.subtitle": { vi: "Chào mừng quản trị viên, giám sát các luồng thi trực tuyến.", en: "Welcome, admin. Monitor online exam activity here." },
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
    "exam.take.confirmSubmit": { vi: "Bạn có chắc chắn muốn nộp bài sớm? Hành động này không thể hoàn tác.", en: "Are you sure you want to finalize and submit early? You cannot undo this." },
    "exam.take.typeAnswer": { vi: "Nhập câu trả lời...", en: "Type your answer here..." },
    "exam.take.characters": { vi: "ký tự", en: "characters" },
    "exam.take.noQuestions": { vi: "Không tìm thấy câu hỏi cho bài thi này.", en: "No questions found for this exam." },
    "exam.take.submitFailed": { vi: "Nộp bài thất bại. Vui lòng kiểm tra kết nối mạng.", en: "Submission failed. Please check your network connection." },

    // Receipt
    "exam.receipt.title": { vi: "Đã nhận bài làm", en: "Submission Received" },
    "exam.receipt.desc": { vi: "Bài làm của bạn đã được ghi nhận thành công.", en: "Your assessment has been successfully recorded." },
    "exam.receipt.timestamp": { vi: "Thời gian nộp", en: "Timestamp" },
    "exam.receipt.returnDashboard": { vi: "Quay lại trang chủ", en: "Return to Dashboard" },
};

export function t(key: string, locale: Locale): string {
    return translations[key]?.[locale] ?? key;
}

export default translations;
