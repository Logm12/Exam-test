# FDB TALENT Enhancement Proposal

This document outlines potential improvements and future features for the FDB TALENT platform.

## Current State

FDB TALENT is a functional examination platform with the following core capabilities:
- Decoupled FastAPI and Next.js architecture.
- Social login integration via NextAuth.js.
- Client-side monitoring for tab tracking, clipboard blocking, and fullscreen enforcement.
- Redis-supported auto-save and rate limiting.
- Mandatory student profile registration flow.
- Dynamic, exam-specific landing pages with configurable posters and rules.
- Full bilingual support (Vietnamese and English).
- Role-separated administrative and student portals.

## Proposed Enhancements

### 1. Webcam-Based Proctoring
Present anti-cheating measures rely on browser events. Integrating webcam monitoring would provide a more robust solution.
- Stream webcam video during examinations via WebRTC.
- Authenticate the live feed against a student identification photo at the start of the session.
- Implement automated flags for off-screen gazing or the presence of multiple individuals using edge-side processing.

### 2. Automated Essay Evaluation
Objective questions are graded instantly, but subjective essay questions currently require manual review.
- Develop an evaluation service using language models.
- Score essays against a defined rubric and ideal answer template.
- Provide suggested scores and highlight key concepts for administrative approval.

### 3. Learning Management System Integration (LTI 1.3)
Supporting LTI 1.3 would allow for seamless integration into existing educational infrastructures.
- Implement LTI 1.3 protocol support.
- Allow students to launch examinations directly from platforms such as Canvas or Moodle.
- Synchronize final scores with the LMS gradebook automatically.

### 4. Advanced Question Analytics
Implementing Item Response Theory (IRT) would allow for more sophisticated performance analysis.
- Apply IRT modeling to identify questions that are statistically miscalibrated.
- Identify questions that are exceptionally simple or unfairly difficult.
- Establish a foundation for adaptive testing where difficulty scales based on student performance.

### 5. Offline Capability (Progressive Web App)
To mitigate connectivity issues, the platform could support offline examination modes.
- Cache the examination payload using service workers.
- Store encrypted answers locally within indexedDB during disconnected periods.
- Synchronize local data with the server once connectivity is restored.

## Documentation Reference

Refer to the `CHANGELOG.md` for historical updates and completed features.

---
*Prepared for architectural review.*
