export type ExamStatus = "LIVE" | "UPCOMING" | "PRACTICE";
export type ExamCategory = "English" | "IT & Programming" | "IQ & Logic" | "General Knowledge";

export interface Exam {
  id: string;
  title: string;
  questions: number;
  duration: string;
  participants: number;
  status: ExamStatus;
  category: ExamCategory;
  description: string;
  startsAt?: string; // ISO string for upcoming exams
  coverImageUrl?: string;
}

export interface Category {
  key: ExamCategory;
  quizzes: number;
}

export interface LeaderboardUser {
  username: string;
  score: number;
}

export const featuredExams: Exam[] = [
  {
    id: "toeic-mini-1",
    title: "TOEIC Mini Test 1",
    questions: 20,
    duration: "15 min",
    participants: 1200,
    status: "LIVE",
    category: "English",
    description: "Fast-paced TOEIC warmup with timed questions and instant feedback.",
  },
  {
    id: "js-fundamentals-quiz",
    title: "JavaScript Fundamentals Sprint",
    questions: 25,
    duration: "20 min",
    participants: 860,
    status: "PRACTICE",
    category: "IT & Programming",
    description: "Sharpen core JS concepts: scope, closures, async, and arrays.",
  },
  {
    id: "logic-quickfire",
    title: "Logic Quickfire (IQ)",
    questions: 18,
    duration: "12 min",
    participants: 640,
    status: "UPCOMING",
    category: "IQ & Logic",
    description: "Speed-run pattern recognition and reasoning under pressure.",
    startsAt: new Date(Date.now() + 1000 * 60 * 25).toISOString(),
  },
  {
    id: "gk-daily-challenge",
    title: "General Knowledge Daily Challenge",
    questions: 30,
    duration: "25 min",
    participants: 1500,
    status: "PRACTICE",
    category: "General Knowledge",
    description: "A fun mix of history, science, and culture — updated daily.",
  },
];

export const categories: Category[] = [
  { key: "English", quizzes: 120 },
  { key: "IT & Programming", quizzes: 95 },
  { key: "IQ & Logic", quizzes: 75 },
  { key: "General Knowledge", quizzes: 140 },
];

export const leaderboardTop5: LeaderboardUser[] = [
  { username: "Nova", score: 9820 },
  { username: "ByteRacer", score: 9470 },
  { username: "LinguaPro", score: 9235 },
  { username: "LogicFox", score: 9010 },
  { username: "QuizStorm", score: 8875 },
];

export const liveExams: Exam[] = [
  {
    id: "english-live-speed",
    title: "English Speed Round (LIVE)",
    questions: 15,
    duration: "10 min",
    participants: 430,
    status: "LIVE",
    category: "English",
    description: "Join the live room, climb the leaderboard in real time.",
  },
  {
    id: "it-live-debug",
    title: "Debug Duel: Python & SQL (LIVE)",
    questions: 12,
    duration: "12 min",
    participants: 290,
    status: "LIVE",
    category: "IT & Programming",
    description: "Spot bugs fast, earn streak points, and compete head-to-head.",
  },
];

export const upcomingExams: Exam[] = [
  {
    id: "iq-upcoming-arena",
    title: "IQ Arena: Patterns & Sequences",
    questions: 20,
    duration: "15 min",
    participants: 0,
    status: "UPCOMING",
    category: "IQ & Logic",
    description: "Starts soon. Warm up and get ready to sprint.",
    startsAt: new Date(Date.now() + 1000 * 60 * 40).toISOString(),
  },
  {
    id: "gk-upcoming-world",
    title: "World Trivia Night",
    questions: 25,
    duration: "20 min",
    participants: 0,
    status: "UPCOMING",
    category: "General Knowledge",
    description: "A live-style trivia kickoff with fresh questions.",
    startsAt: new Date(Date.now() + 1000 * 60 * 75).toISOString(),
  },
];
