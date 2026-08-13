# Check Way AI — Resume Analyzer & Job Matcher

Full-stack implementation of the application blueprint: instant ATS scoring,
job-description skill-gap analysis, an AI bullet optimizer, and a one-click
cover letter generator — built on React, Node/Express, MongoDB, and the
Google Gemini API.

## Project layout

```
resume-analyzer/
├── backend/                 Node.js + Express API
│   ├── config/db.js         Mongoose connection
│   ├── models/               User, Resume, JobAnalysis schemas
│   ├── middleware/           auth (JWT), multer upload, error handler
│   ├── services/
│   │   ├── fileParser.js     PDF/DOCX -> plain text (pdf-parse, mammoth)
│   │   └── geminiService.js  All Gemini prompt templates from the blueprint
│   ├── controllers/          Route handlers
│   ├── routes/                /api/auth, /api/resumes, /api/analysis, /api/cover-letter
│   └── server.js
└── frontend/                 React (Vite) + Tailwind CSS
    └── src/
        ├── api/client.js     Axios instance with JWT auto-attach
        ├── context/AuthContext.jsx
        ├── components/        Navbar, ScoreGauge, SkillBadge, ProtectedRoute
        └── pages/              Home, Login, Register, Dashboard, Upload,
                                 ResumeDetail, JobMatcher
```

## What's implemented vs. the blueprint

| Blueprint item | Status |
|---|---|
| Multi-format upload & parsing (PDF/DOCX) | ✅ `services/fileParser.js` |
| AI ATS scoring & diagnostic breakdown | ✅ `services/geminiService.js` → `analyzeResumeText` |
| Target job matcher & skill gap analysis | ✅ `analysis/match` route + `JobMatcher.jsx` |
| AI resume bullet optimizer | ✅ `resumes/:id/optimize-bullets` route |
| User dashboard & tracker | ✅ `Dashboard.jsx`, `analysis/resume/:id/history` |
| JWT auth (register/login) | ✅ `authRoutes.js`, bcrypt password hashing |
| Rate limiting on AI calls | ✅ `express-rate-limit` in `server.js` |
| One-click AI cover letter generator | ✅ `cover-letter/generate` route |
| Export evaluation as PDF | ⚠️ Not included — see "Next steps" below |
| Live job board integration | ⚠️ Not included — future enhancement per blueprint |
| Interactive mock interviewer | ⚠️ Not included — future enhancement per blueprint |

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env    # fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev              # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```

You'll need a running MongoDB instance (local or Atlas) and a Gemini API key
from Google AI Studio.

## Next steps (from the blueprint's "Future Enhancements")

- **PDF export**: add a `/api/resumes/:id/export` route using `pdfkit`
  (already listed as a backend dependency) to render the ATS report as a
  downloadable PDF.
- **Live job board integration**: wire a JSearch/Adzuna client into
  `analysisController.js` so `JobMatcher` can suggest real postings that
  match the parsed skillset.
- **Mock interviewer**: a new Gemini prompt template + chat-style route that
  generates questions targeting the `missingSkills` from a `JobAnalysis`.

## Design notes

The frontend uses a custom token system (not a default template): a warm
paper background, ink/signal-green/clay accent palette, Fraunces for display
type, Inter for body, and JetBrains Mono for scores — with a signature
scanning-line animation on the hero to reflect the product's core action.
