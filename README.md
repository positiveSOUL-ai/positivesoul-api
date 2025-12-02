<p align="center">
  <img src="https://raw.githubusercontent.com/positiveSOUL-ai/positiveSOUL-media/main/logo_positivesoul_ai_coach.png" 
       alt="positiveSOUL AI Coach Logo" 
       width="140" />
</p>

<h1 align="center">positiveSOUL AI Coach — API</h1>

<p align="center"><em>AI that guides — not gives.</em></p>

<hr/>
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
- Canonical PDF: `docs/ruleset/positiveSOUL AI Coach Brain Ruleset – Master v1.2 (January 2026).pdf`

### Documentation Hub  
Located in `docs/`:

- `ruleset/` — Official brain rules  
- `architecture/` — Flow diagrams & backend overview  
- `education/` — Fælles Mål alignment  
- `licensing/` — Pilot program + school licensing model  
- `media/` — Optional branding assets

---

## 🔧 API Endpoint: `/api/coach`

**Method:** `POST`  
**Description:**  
Processes user messages with:

- Subject detection  
- Context persistence  
- Role-based teaching modes  
- Guardrails  
- Sanitizers (e.g., *never give final math results*)

**Health Check:**  
`GET /api/coach` returns version info:

```json
{
  "ok": true,
  "route": "/api/coach",
  "apiVersion": "1.2.0",
  "rulesetVersion": "Master v1.2",
  "status": "running"
}
