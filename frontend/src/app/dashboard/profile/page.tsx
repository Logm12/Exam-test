"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/api";

export default function ProfileCompletionPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        full_name: "",
        date_of_birth: "",
        cccd: "",
        address: "",
        phone: "",
        email: "",
        school: "",
        mssv: "",
        class_name: "",
        lien_chi_doan: ""
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/dashboard/profile");
            return;
        }
        if (status === "authenticated" && session?.user) {
            // Load existing profile if any
            fetcher("/students/me/profile", {
                headers: { Authorization: `Bearer ${(session as any).accessToken}` }
            })
                .then(data => {
                    if (data && !data.detail) {
                        setFormData({
                            full_name: data.full_name || "",
                            date_of_birth: data.date_of_birth || "",
                            cccd: data.cccd || "",
                            address: data.address || "",
                            phone: data.phone || "",
                            email: data.email || "",
                            school: data.school || "",
                            mssv: data.mssv || "",
                            class_name: data.class_name || "",
                            lien_chi_doan: data.lien_chi_doan || ""
                        });
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error loading profile:", err);
                    setIsLoading(false);
                });
        }
    }, [status, session, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            await fetcher("/students/me/profile", {
                method: "PUT",
                headers: { Authorization: `Bearer ${(session as any).accessToken}` },
                body: JSON.stringify(formData)
            });

            // Update session profile_completed to true
            await update({ profile_completed: true });
            
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to update profile. Please check your inputs.");
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8 bg-[var(--surface-card)] p-10 rounded-2xl shadow-xl border border-[var(--border-subtle)]">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-[#1e3a8a] tracking-tight">
                        Cập nhật hồ sơ sinh viên
                    </h2>
                    <p className="mt-3 text-center text-sm text-[var(--text-secondary)]">
                        Vui lòng hoàn thành thông tin cá nhân của bạn trước khi tham gia thi.
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-4 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-200 shadow-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {/* Required Fields */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Họ và tên *</label>
                            <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Ngày tháng năm sinh *</label>
                            <input type="date" name="date_of_birth" required value={formData.date_of_birth} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Số CCCD *</label>
                            <input type="text" name="cccd" required value={formData.cccd} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Địa chỉ sinh sống *</label>
                            <input type="text" name="address" required value={formData.address} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Số điện thoại *</label>
                            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Gmail *</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Học tại trường *</label>
                            <input type="text" name="school" required value={formData.school} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" placeholder="VD: Trường Đại học Giao thông Vận tải" />
                        </div>

                        {/* Optional Fields */}
                        <div className="sm:col-span-2 pt-4 border-t border-[var(--border-subtle)] mt-2">
                            <h3 className="text-lg font-bold text-[#1e3a8a] mb-1">Thông tin bổ sung</h3>
                            <p className="text-xs text-[var(--text-secondary)] mb-4">Dành cho sinh viên (Học sinh THPT có thể bỏ qua Mã SV)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Mã số sinh viên</label>
                            <input type="text" name="mssv" value={formData.mssv} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Lớp</label>
                            <input type="text" name="class_name" value={formData.class_name} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Liên chi đoàn</label>
                            <input type="text" name="lien_chi_doan" value={formData.lien_chi_doan} onChange={handleChange} className="block w-full rounded-xl border border-[var(--border-default)] px-4 py-3 bg-[var(--bg-primary)] text-[var(--text-primary)] focus:ring-[#1e3a8a] focus:border-[#1e3a8a] transition-all" placeholder="Điền liên chi đoàn (VD: Khoa CNTT)" />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-[#1e3a8a] hover:bg-[#152960] focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/40 transition-all disabled:opacity-70"
                        >
                            {isSubmitting ? "Đang lưu..." : "Hoàn Tất Hồ Sơ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
