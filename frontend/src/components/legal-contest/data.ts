import type { ContactInfo, LeaderboardRow } from "@/components/legal-contest/types";

export const contestInfo = {
  title: "CUOC THI TIM HIEU PHAP LUAT NAM 2025",
  titleDisplay: "CUỘC THI TÌM HIỂU PHÁP LUẬT NĂM 2025",
  subtitle: "Hưởng ứng ngày pháp luật Việt Nam (09/11/2025)",
  intro:
    "Cuộc thi tìm hiểu pháp luật năm 2025 - Đoàn TNCS Hồ Chí Minh Trường Quốc tế, ĐHQGHN",
  endsAtIso: "2025-11-09T23:59:59+07:00",
} as const;

export const contactInfo: ContactInfo = {
  organizerName: "Ban Tổ Chức Cuộc Thi Tìm Hiểu Pháp Luật 2025",
  address: "Trường Quốc tế, ĐHQGHN",
  phone: "(024) 0000 0000",
  email: "btc.phapluat2025@example.com",
  devName: "Đơn vị lập trình",
  devCompany: "Công ty Công nghệ (Sample)",
  moreLinkHref: "#",
};

export const leaderboardTeam: LeaderboardRow[] = [
  { id: "t1", name: "Khoa CNTT", registrations: 420 },
  { id: "t2", name: "Khoa Kinh tế", registrations: 388 },
  { id: "t3", name: "Khoa Ngôn ngữ", registrations: 355 },
  { id: "t4", name: "Khoa Luật", registrations: 332 },
  { id: "t5", name: "Khoa Truyền thông", registrations: 310 },
  { id: "t6", name: "Khoa Du lịch", registrations: 280 },
  { id: "t7", name: "Khoa Quốc tế học", registrations: 266 },
  { id: "t8", name: "Khoa Tài chính", registrations: 251 },
  { id: "t9", name: "Khoa Khoa học dữ liệu", registrations: 240 },
  { id: "t10", name: "Khoa Sư phạm", registrations: 233 },
  { id: "t11", name: "CLB Tình nguyện", registrations: 210 },
  { id: "t12", name: "CLB Học thuật", registrations: 196 },
];

export const leaderboardIndividual: LeaderboardRow[] = [
  { id: "i1", name: "Nguyễn Minh Anh", registrations: 38 },
  { id: "i2", name: "Trần Quốc Huy", registrations: 34 },
  { id: "i3", name: "Lê Thu Hà", registrations: 33 },
  { id: "i4", name: "Phạm Đức Long", registrations: 31 },
  { id: "i5", name: "Vũ Ngọc Mai", registrations: 29 },
  { id: "i6", name: "Bùi Gia Hân", registrations: 27 },
  { id: "i7", name: "Hoàng Nhật Nam", registrations: 26 },
  { id: "i8", name: "Đặng Quỳnh Anh", registrations: 25 },
  { id: "i9", name: "Ngô Quang Vinh", registrations: 24 },
  { id: "i10", name: "Đỗ Khánh Linh", registrations: 23 },
  { id: "i11", name: "Nguyễn Tiến Đạt", registrations: 22 },
  { id: "i12", name: "Lý Bảo Ngọc", registrations: 21 },
];
