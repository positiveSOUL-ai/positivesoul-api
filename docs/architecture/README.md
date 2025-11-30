# 🏗️ Architecture Overview — positiveSOUL AI Coach

This folder contains system diagrams, flow explanations, and backend architecture details for the **positiveSOUL AI Coach**.  
Its purpose is to make the technical structure clear for contributors, partners, and future audits.

---

## 🔧 High-Level System Components

### **1. Frontend (Coach UI)**
- Next.js interface for students, teachers, and leadership  
- Sends requests to the backend through `/api/coach`  
- Supports role selection, subject selection, language preference, and history persistence  
- Hosted on Vercel  
- Repository: `positivesoul-ai/positivesoul-ui` (if separate)

---

### **2. Backend API (This Repository)**
Responsible for:
- Loading the Master Ruleset at runtime  
- Enforcing guardrails and “guide, not give” protocol  
- Detecting subject context  
- Applying role mode logic (student, teacher, leadership, parent)  
- Sanitizing math outputs (no final numeric answers)  
- Building the OpenAI message chain  
- Sending structured requests to OpenAI  
- Returning safe, pedagogical responses  

Main route:

