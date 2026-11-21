# MindMetrics – React frontend for the Mental Health Score API

## Setup
```bash
npm install
npm run dev        # http://localhost:5173
```
`.env` (already included):
```
VITE_API_URL=http://127.0.0.1:2200
```
## Backend
```bash
uvicorn app:app --reload --port 2200
```
Your `app.py` already allows all origins via CORSMiddleware, so no CORS change is needed.
To restrict it later: `allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"]`.
