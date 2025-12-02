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

Below is the complete end-to-end request lifecycle.

