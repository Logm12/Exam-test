# ExamOS Enhancement Proposal

This document outlines potential improvements and future features for the ExamOS platform.

## Current State

ExamOS is a working exam platform with:
- FastAPI + Next.js architecture
- Social login (Google, Zalo) via NextAuth.js
- Client-side anti-cheating (tab tracking, clipboard blocking, fullscreen enforcement)
- Redis-backed auto-save and rate limiting
- Bilingual UI (Vietnamese / English)
- Role-separated portals (admin dashboard, student portal)

## Proposed Enhancements

### 1. Webcam-Based Proctoring

Current anti-cheating relies on browser events, which can be bypassed with a second device.

- Stream webcam video during exams via WebRTC
- Compare live feed against a student ID photo at exam start
- Flag off-screen gazing or multiple faces in frame using edge-side processing

### 2. Automated Essay Grading

Multiple-choice and short-answer questions are graded instantly, but essay questions still need manual review.

- Build a grading microservice using language models
- Score essays against a rubric and ideal answer
- Return a suggested score with highlighted matching concepts for reviewer approval

### 3. LMS Integration (LTI 1.3)

Many institutions use centralized Learning Management Systems and prefer not to use standalone tools.

- Implement LTI 1.3 protocol support
- Allow students to launch exams directly from Canvas, Moodle, or Blackboard
- Push final scores back to the LMS gradebook automatically

### 4. Question Analytics (IRT)

Simple percentage scores don't distinguish between genuine knowledge and lucky guesses.

- Apply Item Response Theory modeling to identify poorly calibrated questions
- Flag questions that are statistically too easy or unfairly difficult
- Lay groundwork for adaptive testing where question difficulty adjusts based on prior answers

### 5. Offline Support (PWA)

In regions with unreliable connectivity, mid-exam disconnections are common.

- Cache the exam payload on the client via service workers
- Store answers in IndexedDB during offline periods
- Sync encrypted answers back to the server when the connection is restored

## Related Files

See `CHANGELOG.md` for historical patches and completed integrations.

---
*Prepared for future architectural review.*
