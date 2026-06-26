# 🚀 GapAnalyze: AI-Powered ATS Resume Optimizer

**Live Demo:** [https://project-gap-analyze.vercel.app](https://project-gap-analyze.vercel.app)

GapAnalyze is a high-throughput, privacy-first web application designed to help job seekers bridge the gap between their resumes and target job descriptions. By leveraging OpenAI's Structured Outputs, the platform performs deep ATS (Applicant Tracking System) keyword analysis, scores compatibility, and generates actionable bullet-point optimizations.

## ✨ Core Features
* 📊 **Instant ATS Scoring:** Evaluates resume compatibility against a target job description.
* 🔍 **Keyword Gap Analysis:** Clearly highlights extracted matched keywords vs. missing keywords.
* 🛠️ **Smart Bullet Optimization:** AI suggests optimized, action-oriented bullet points based on the job requirements.
* 🔒 **Privacy-First Architecture:** 100% stateless design. Resumes are parsed in-memory and never stored in a database, ensuring maximum user data security.
* 📄 **Multi-Format Parsing:** Seamlessly extracts text from both `.pdf` and `.docx` files.

## 💻 Tech Stack
**Frontend:**
* React.js (Vite)
* Hosted on **Vercel**

**Backend:**
* Node.js & Express.js
* OpenAI API (`gpt-4o-mini` with strict `json_schema` enforced)
* `multer` (In-memory storage), `pdf-parse`, `mammoth`
* Hosted on **Render** (Maintained via 5-min Cron heartbeat)

## 📁 Project Architecture
This repository is structured as a monorepo:
```text
GAPANALYZE/
├── Backend/      # Node.js Express server handling API & OpenAI logic
└── Frontend/     # React.js Vite application handling the UI/UX
