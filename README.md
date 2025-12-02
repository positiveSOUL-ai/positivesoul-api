<h1 align="center">positiveSOUL AI Coach — API</h1>

<p align="center"><em>AI that guides — not gives.</em></p>

---

# 🎓 positiveSOUL AI Coach — API  
**AI that guides — not gives.**  
The official backend for the positiveSOUL AI Coach: a guidance-based educational AI designed for the Danish Folkeskole and aligned with *Fælles Mål*.

---

## 🚀 What This API Does

This service powers the positiveSOUL AI Coach by:

- Loading the **Master Ruleset v1.2** (`brain/ruleset.md`)
- Enforcing **guide-not-give** guardrails  
- Applying role modes (student, teacher, leadership, parent)
- Maintaining **Context Persistence** & subject locking  
- Running **few-shot teaching protocols**  
- Processing input via OpenAI with safe, structured prompts  
- Returning **short, supportive, step-based educational responses**

Frontend ↔ Backend communication happens through the `/api/coach` endpoint.

---

## 📦 Live Services

- **Frontend (Coach UI):**  
  https://positivesoul-ai.vercel.app/coach

- **API Repository (this repo):**  
  https://github.com/positiveSOUL-ai/positivesoul-api

---

## 🧠 Ruleset & Documentation

### **Master Ruleset v1.2 (January 2026)**  
Defines the AI Coach’s identity, tone, pedagogy, guardrails, and subject logic.

- Runtime file: `brain/ruleset.md`  
- Canonical PDF:  
  `docs/ruleset/positiveSOUL AI Coach Brain Ruleset – Master v1.2 (January 2026).pdf`

---

## 📁 Documentation Structure

The repository includes a complete documentation suite inside the `/docs` folder.

### **`/docs/ruleset/`**
Contains:
- Master Ruleset v1.2  
- Runtime ruleset file  
- Canonical PDF for audits & curriculum alignment

### **`/docs/architecture/`**
Includes backend flow diagrams, API request/response explanations, and high-level system structure.

### **`/docs/education/`**
Fælles Mål alignment, pedagogy notes, and school-facing documentation.

### **`/docs/licensing/`**
Pilot program model, usage rights, and legal structure.

### **`/docs/media/`**
Optional screenshots, diagrams, or branding materials.

---

## 🔧 API Endpoint: `/api/coach`

**Method:** `POST`  
**Description:**  
Processes user messages with:

- Subject detection  
- Context persistence  
- Role-based teaching modes  
- Guardrails  
- Sanitizers (e.g., *never give final math answers*)

---

🩺 Health Check
GET /api/coach returns version and status:
{
  "ok": true,
  "route": "/api/coach",
  "apiVersion": "1.2.0",
  "rulesetVersion": "Master v1.2",
  "status": "running"
}
👤 Maintainer
Albert Campos
Creator of positiveSOUL AI Coach
Educator & Music Specialist, Copenhagen
Founder of positiveSOUL Productions & positiveSOUL.ai
GitHub: https://github.com/positiveSOUL-ai
Website: https://positivesoul.ai
For inquiries about partnerships, pilot programs, or school use,
contact: albert@positivesoul.ai
