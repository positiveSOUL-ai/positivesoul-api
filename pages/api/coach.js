// pages/api/coach.js
// positiveSOUL AI Coach — API route
import fs from "fs";
import path from "path";
import OpenAI from "openai";

// ---------- CONFIG ----------
const MODEL = process.env.MODEL || "gpt-4o-mini";
const TEMP = Number(process.env.TEMP ?? 0.3);

// ---------- RULESET LOADER ----------
function readRuleset() {
  try {
    const p = path.join(process.cwd(), "brain", "ruleset.md");
    return fs.readFileSync(p, "utf8");
  } catch (e) {
    console.warn("[positiveSOUL AI Coach] ruleset.md not found. Falling back to minimal rules.");
    return `
positiveSOUL AI Coach — guidance-based AI for Danish schools.
Guide, don’t give final products. Use Context Persistence: stay in the same subject unless the user explicitly switches.
`.trim();
  }
}

/* =========================================================
   SUBJECT LOCKING & CONTEXT PERSISTENCE (UPDATED)
   - Accepts explicit subject from UI (preferred)
   - Better detection for MUSIC (notes/clefs/scales)
   - Defaults to ENGLISH to avoid math-first drift
========================================================= */

// Canonicalize incoming subject strings
function canonicalSubject(s) {
  if (!s) return null;
  const t = String(s).toLowerCase().trim();
  if (/(^|[^a-z])(eng|english|engelsk)([^a-z]|$)/.test(t)) return "english";
  if (/(^|[^a-z])(mat|math|matematik)([^a-z]|$)/.test(t)) return "math";
  if (/(^|[^a-z])(musik|music)([^a-z]|$)/.test(t)) return "music";
  if (/(^|[^a-z])(hist|history|historie)([^a-z]|$)/.test(t)) return "history";
  return null;
}

// Ambiguity note: "notes" can mean study notes or music notes.
// We bias to MUSIC if context mentions clef/scale/staff/beat/etc.
const SUBJECT_KEYWORDS = {
  english: [
    "english","engelsk","vocabulary","grammar","phrases","dialogue","sentence","ordforråd",
    "reading","speaking","listening","writing"
  ],
  math: [
    "math","matematik","division","multiplication","algebra","fraction","fractions",
    "brøk","procent","plus","minus","times","multiply","divide","÷","×","+","-","=",
    "equation","long division"
  ],
  music: [
    "music","musik","rhythm","beat","tempo","meter","measure","bar","time signature",
    "note","notes","music note","reading music","read music","sheet music","staff","stave",
    "clef","treble clef","bass clef","ledger line","scale","scales","major","minor",
    "interval","melody","harmony","chord","ostinato","body percussion","sing","songwriting",
    "instrument","guitar","piano","drums","kor","kord"
  ],
  history: [
    "history","historie","timeline","period","events","kanon","kilder","kilde",
    "source analysis","historical"
  ],
};

function detectSubjectFromText(txt) {
  const t = (txt || "").toLowerCase();

  // Special case: "notes" + any music anchor → music
  if (/\bnotes?\b/.test(t) && /\b(clef|scale|staff|stave|beat|meter|measure|bar|treble|bass|sheet|read(ing)? music)\b/.test(t)) {
    return "music";
  }

  for (const [subject, words] of Object.entries(SUBJECT_KEYWORDS)) {
    if (words.some((w) => t.includes(w))) return subject;
  }
  return null;
}

function inferSubject({ message, history = [] }) {
  for (let i = history.length - 1; i >= 0; i--) {
    const s = detectSubjectFromText(history[i]?.content || "");
    if (s) return s;
  }
  return detectSubjectFromText(message);
}

/* =========================================================
   FEW-SHOTS (REORDERED)
   Put an English example FIRST to avoid cold-start math bias.
========================================================= */
const FEWSHOT = [
  // English first
  {
    role: "user",
    content: "Teach me the basics of English."
  },
  {
    role: "assistant",
    content:
"Let's start with greetings 👋 and simple words.\n- Hello! / Goodbye!\n- My name is ____.\n- I like ____.\nWhich one do you want to practice first?"
  },

  // Music example
  {
    role: "user",
    content: "Hi Coach, give me ideas for rhythm activities in music class."
  },
  {
    role: "assistant",
    content:
`Let’s try three rhythm activities (grades 4–6):
1) 👐 Body percussion call-and-response.
2) 🥁 Ostinato layers: clap a base pulse, add a simple rhythm on top.
3) 🎵 Rhythm cards: draw 2–3 and perform them in canon.
Which one do you want to try first? (Aligned with Fælles Mål – Music: performance, creation, understanding.)`
  },

  // Guardrail refusal example
  {
    role: "user",
    content: "Write a complete assignment for me."
  },
  {
    role: "assistant",
    content:
`I can’t write the full assignment 🚫, but I can sketch it for you:
• 3 topic ideas  
• A 5-step outline  
• Sentence starters  
• A checklist ✅  
Would you like to start with the outline or checklist?`
  },

  // Math example
  {
    role: "user",
    content: "Can you solve 12 ÷ 3?"
  },
  {
    role: "assistant",
    content:
`Imagine 12 apples 🍎 and 3 friends 🤝. Share equally.
Give one apple to each friend, then another, until none are left.
👉 How many apples does each friend get? Tell me. 😊`
  }
];

// ---------- HANDLER ----------
export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      route: "/api/coach",
      version: "brain v3 + context-persistence + no-final-answer",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const {
      message = "",
      role = "student",
      language,
      history = [],
      subject,
    } = req.body || {};

    if (!message.trim()) {
      return res.status(400).json({ error: "Missing 'message' in body" });
    }

    const RULESET = readRuleset();

    const ROLE_HINT =
      role === "teacher"
        ? "You are supporting a Danish teacher. Map to Fælles Mål and classroom routines."
        : role === "leadership"
        ? "You are advising school leadership. Focus on policies and safe implementation."
        : role === "parent"
        ? "You are guiding a parent with supportive, simple steps at home."
        : "You are helping a Danish folkeskole student with short, stepwise answers.";

    const LANG_HINT =
      language === "da"
        ? "Reply in Danish."
        : /[ÆØÅæøå]|( og | ikke | jeg | du )/.test(message)
        ? "Reply in Danish."
        : "Reply in English unless the user clearly writes Danish.";

    const chosen = canonicalSubject(subject);
    const inferred = inferSubject({ message, history });
    const activeSubject = chosen || inferred || "english";
    const subjectLine = "Active Subject (Context Persistence): " + activeSubject;

    const SYSTEM = `
You are the positiveSOUL AI Coach.

IDENTITY & TONE
- Soulful, smooth, encouraging. Guide, never give final products.
- Celebrate effort. Be kind and confident.

GUARDRAILS
- Never give finished essays or homework.
- For math, NEVER reveal the final numeric result. Always stop one step before and ask the student to finish.
- If asked for full work, refuse and offer outline, steps, checkpoints, rubric, or a small model.

TEACHING PROTOCOL (4 GEARS)
1) Emojis / visuals 🍎🟦😊 to lower the barrier.
2) Sentence starters.
3) Guiding questions with concrete steps/examples.
4) Reflection (“How do you know?” / “Check another way.”)
Rhythm: Ask → Wait → Encourage → Hint → Ask again.

FÆLLES MÅL
- Musik: musikudøvelse, musikalsk skaben, musikforståelse.
- Matematik: problembehandling, repræsentation, modellering, kommunikation.

STYLE
- Concise, concrete, 2–3 choices, then a question.
- With younger students, keep sentences short (≤12 words) and emoji-friendly.
`.trim();

    const messages = [
      { role: "system", content: subjectLine },
      { role: "system", content: "Context Rule: Interpret generic follow-ups (e.g., 'basics', 'examples', 'history') within the CURRENT subject unless the user explicitly switches." },
      { role: "system", content: RULESET },
      { role: "system", content: SYSTEM },
      { role: "system", content: `Context: ${ROLE_HINT} ${LANG_HINT}` },
      ...FEWSHOT,
      ...history,
      { role: "user", content: message },
    ];

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: TEMP,
      max_tokens: 650,
      messages,
    });

    let reply =
      completion?.choices?.[0]?.message?.content ??
      "Jeg er her. Prøv igen? / I’m here—try again?";

    // --- SANITIZER: strip accidental final math answers ---
    try {
      const userAskedMath =
        /(\d+\s*[\+\-x×*\/÷]\s*\d+)/i.test(message) ||
        /\b(add|plus|minus|subtract|times|multiply|divide|divided by|gange|minus|plus|divider)\b/i.test(message);

      if (userAskedMath) {
        reply = reply.replace(
          /(^|\n).*?\d+\s*([+x×\-÷\/*])\s*\d+\s*(=|equals?)\s*-?\d+(\.\d+)?[^\n]*\n?/gi,
          ""
        );
        reply = reply.replace(
          /(^|\n).*?\b(equals?|=)\s*-?\d+(\.\d+)?[^\n]*\n?/gi,
          ""
        );

        if (!reply.trim()) {
          reply =
            "Let’s share apples 🍎. You have 12 apples and 3 friends. 👉 How many does each friend get?";
        }
        if (!/[?？！]$/.test(reply.trim())) {
          reply = reply.trim().replace(/[.!]+$/, "") + " What do you think? 😊";
        }
      }
    } catch (e) {
      console.error("Sanitizer failed", e);
    }

    return res.status(200).json({ reply });
  } catch (err) {
    const code = err?.status || err?.statusCode || 500;
    const info = {
      name: err?.name,
      status: err?.status || err?.statusCode,
      message: err?.message,
      error: err?.error || err?.response?.data || undefined,
    };
    console.error("positiveSOUL API error:", info);
    return res.status(code).json({ error: "Upstream error", detail: info });
  }
}
