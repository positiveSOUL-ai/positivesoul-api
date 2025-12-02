# 🏗️ Architecture Overview — positiveSOUL AI Coach

This folder contains system diagrams, flow explanations, and backend architecture details for the **positiveSOUL AI Coach**.  
Its purpose is to make the technical structure clear for contributors, partners, and future audits.

---

## 🔧 High-Level System Components

### **1. Frontend (Coach UI)**
- Built with Next.js  
- Interface for students, teachers, leadership, and parents  
- Sends structured requests to the backend through:  
  `/api/coach`
- Supports role selection, subject selection, language preference, and history persistence  
- Hosted on Vercel  
- Repo (if separate):  
  `positiveSOUL-ai/positivesoul-ui`

---

### **2. Backend API (This Repository)**
Responsible for:

- Loading the **Master Ruleset** at runtime  
- Enforcing guardrails and the *guide–not–give* teaching protocol  
- Detecting subject context  
- Applying role modes (student, teacher, leadership, parent)  
- Maintaining **Context Persistence**  
- Sanitizing outputs  
- Communicating with OpenAI using structured message chains  
- Returning safe, supportive, step-based educational responses  

Main route:  
`/pages/api/coach.js`

---

## 🧠 AI Processing Pipeline (Runtime Flow)

Below is the complete end-to-end request lifecycle:

```
┌──────────────────────┐
│      Frontend UI      │
│  (student/teacher)    │
└──────────┬───────────┘
           │ POST /api/coach
           ▼
┌────────────────────────────────┐
│        Backend API Layer       │
│  - Validates request           │
│  - Loads RULESET (brain/)      │
│  - Determines role & language  │
└──────────┬────────────────────┘
           │
           ▼
┌────────────────────────────────┐
│   Subject Engine & Context     │
│  - Canonical subject parsing   │
│  - Follow-up context locking   │
│  - Few-shot ordering           │
└──────────┬────────────────────┘
           │
           ▼
┌────────────────────────────────┐
│      OpenAI Runtime Model      │
│  - Structured messages         │
│  - Guardrail enforcement       │
│  - No final math answers       │
│  - No finished assignments     │
└──────────┬────────────────────┘
           │
           ▼
┌──────────────────────┐
│   Response Builder    │
│ - Sanitizes output    │
│ - Adds teaching cues  │
│ - Ensures safety      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Frontend UI      │
│  Displays final reply │
└──────────────────────┘
```

---

## 📁 Architecture-Relevant Folder Structure

```
positiveSOUL-api/
│
├── brain/
│   └── ruleset.md            # Master Ruleset (runtime)
│
├── pages/
│   └── api/
│       └── coach.js          # Main API logic
│
└── docs/
    └── architecture/
        └── README.md         # This document
```

---

## 📌 Notes for Future Development

- Add PNG/SVG versions of diagrams (optional)  
- Add sequence diagrams for role-based interactions  
- Add conversation logging architecture (if implemented later)  
- Add rate limiting or audit log design  
- Add data schemas for storing long-term AI learning profiles (optional)

---

## ✅ Summary

This document defines the **technical blueprint** for how the positiveSOUL AI Coach processes input, enforces guardrails, maintains subject context, and interacts with OpenAI.

It is now ready for:

- External audits  
- Developer onboarding  
- Pedagogical review  
- Future expansion  
