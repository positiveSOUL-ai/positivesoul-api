# 🎹 positiveSOUL AI Coach — API  
**AI that guides — not gives.**  
The official backend for the positiveSOUL AI Coach — a guidance-based educational AI designed for the Danish Folkeskole and aligned with Fælles Mål.

---

## 🌟 What This API Does
This service powers the positiveSOUL AI Coach by:

- Loading the **Master Ruleset v1.2** (`brain/ruleset.md`)
- Maintaining **Context Persistence** (subject detection + locking)
- Applying **Role Modes**: student, teacher, leadership, parent
- Enforcing **strict guardrails** (no full assignments, no final math answers)
- Providing **structured, creative, student-safe guidance**

Frontend ↔ Backend communication happens through the `/api/coach` endpoint.

---

## 🚀 Live Services
- **Frontend (Coach UI):**  
  https://positivesoul-ai.vercel.app/coach

- **API Repository:**  
  https://github.com/positiveSOUL-ai/positivesoul-api

---

## 📁 File Structure
