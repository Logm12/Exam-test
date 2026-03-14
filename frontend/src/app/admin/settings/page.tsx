"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SystemSettingsPage() {
    const router = useRouter();
    const [platformName, setPlatformName] = useState("ExamOS");
    const [maxDuration, setMaxDuration] = useState(180);
    const [allowRegistration, setAllowRegistration] = useState(true);
    const [enforceAntiCheat, setEnforceAntiCheat] = useState(true);
    const [requireFullscreen, setRequireFullscreen] = useState(true);
    const [autoGrading, setAutoGrading] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // Settings are client-side for this iteration.
        // In production, these would be persisted to the backend.
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8 animate-fade-in w-full">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
                    Cài đặt hệ thống
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Cấu hình hành vi nền tảng và chính sách bảo mật.
                </p>
            </div>

            {saved && (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-100 flex items-center space-x-2">
                    <span className="font-medium">Lưu cài đặt thành công.</span>
                </div>
            )}

            {/* General Settings */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100">
                    <h2 className="text-base font-medium text-neutral-900">Cài đặt chung</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Cấu hình lõi của hệ thống</p>
                </div>
                <div className="divide-y divide-neutral-100">
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Tên Nền Tảng</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Hiển thị ở tiêu đề và email</p>
                        </div>
                        <input
                            type="text"
                            value={platformName}
                            onChange={(e) => setPlatformName(e.target.value)}
                            className="w-48 px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Thời Gian Thi Tối Đa</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Giới hạn thời gian (phút) cho một bài thi</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                value={maxDuration}
                                onChange={(e) => setMaxDuration(parseInt(e.target.value))}
                                min={10}
                                max={600}
                                className="w-24 px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-right"
                            />
                            <span className="text-xs text-neutral-500">phút</span>
                        </div>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Cho Phép Đăng Ký</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Cho phép người dùng mới tự đăng ký</p>
                        </div>
                        <button
                            onClick={() => setAllowRegistration(!allowRegistration)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${allowRegistration ? "bg-indigo-600" : "bg-neutral-300"}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${allowRegistration ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Security Settings */}
            <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-100">
                    <h2 className="text-base font-medium text-neutral-900">Bảo Mật & Chống Gian Lận</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Các chính sách kiểm soát tính toàn vẹn của bài thi</p>
                </div>
                <div className="divide-y divide-neutral-100">
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Hành Vi Chống Gian Lận</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Chặn chuột phải, sao chép thả và phím tắt khi thi</p>
                        </div>
                        <button
                            onClick={() => setEnforceAntiCheat(!enforceAntiCheat)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${enforceAntiCheat ? "bg-indigo-600" : "bg-neutral-300"}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${enforceAntiCheat ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Bắt Buộc Toàn Màn Hình</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Yêu cầu chế độ toàn màn hình khi làm bài</p>
                        </div>
                        <button
                            onClick={() => setRequireFullscreen(!requireFullscreen)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${requireFullscreen ? "bg-indigo-600" : "bg-neutral-300"}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${requireFullscreen ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-neutral-900">Tự Động Chấm Điểm</label>
                            <p className="text-xs text-neutral-500 mt-0.5">Tự động chấm các câu trắc nghiệm ngay khi nộp</p>
                        </div>
                        <button
                            onClick={() => setAutoGrading(!autoGrading)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${autoGrading ? "bg-indigo-600" : "bg-neutral-300"}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${autoGrading ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-red-100 bg-red-50/30">
                    <h2 className="text-base font-medium text-red-900">Khu Vực Nguy Hiểm</h2>
                    <p className="text-xs text-red-500 mt-0.5">Các hành động không thể hoàn tác</p>
                </div>
                <div className="px-6 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-neutral-900">Đăng Xuất</p>
                        <p className="text-xs text-neutral-500 mt-0.5">Kết thúc phiên hiện tại và quay lại màn hình đăng nhập</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Đăng Xuất
                    </button>
                </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-indigo-200 transition-all"
                >
                    Lưu Cài Đặt
                </button>
            </div>
        </div>
    );
}
