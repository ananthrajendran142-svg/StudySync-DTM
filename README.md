# StudySync — AI-Powered Self-Proctored Learning Platform

> **Plan • Focus • Track • Improve**  
> StudySync is an AI-driven focus, smart planning, group session, and self-proctored learning application built for SRM IT Design Thinking & Methodology (DTM).

---

## 🌟 Key Features

1. **Smart Planner & Task Scheduling**: Organize daily study tasks, set priorities (High, Medium, Low), deadlines, and track completion progress.
2. **Focus Room & Custom Timer**: Customizable Pomodoro focus sessions with `-5m` / `+5m` steppers, strict shield mode, notes upload, and opt-in quiz setting.
3. **AI PDF Document Analysis & Quiz Generation**: FastAPI backend with TF-IDF RAG engine extracts questions directly from user-uploaded PDF notes.
4. **Group Study & Peer Invites**: Interactive group study sessions with member invitation modals and real-time roster management.
5. **Tab-Exit Anti-Proctoring Protection**: Live tab-switch detection that automatically flags or disqualifies users who leave the window during AI-proctored quizzes.
6. **Rewards, Streaks & Digital Certificates**: Earn Study Points, maintain daily streaks, unlock achievement badges, and redeem printable PDF digital certificates.
7. **Procrastination Risk Analytics**: Interactive Recharts progress tracking and real-time AI behavioral coaching feedback.
8. **Authentication & Profile**: Complete user authentication (Login/Register) with full user state persisted in `localStorage`.

---

## 🛠️ System Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, HTML5 Web Speech API
- **Backend**: Python 3.10+, FastAPI, Uvicorn, PyPDF text extraction, Scikit-learn TF-IDF vectorizer

---

## 🚀 Quickstart Guide

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
Backend API will run at `http://127.0.0.1:8000`.

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend application will open at `http://localhost:5173` (or available local port).

---

## 📄 Dataset & Reference Documents
- `Student Procrastination & Study Habits Survey (Responses).pdf`: Behavioral dataset used for AI coaching & procrastination risk calculation.
- `Self-Proctored Learning Excellence Overview (3) (1).pdf`: Official SRM DTM project design document.

---
Developed for SRM IT Design Thinking & Methodology (DTM).
