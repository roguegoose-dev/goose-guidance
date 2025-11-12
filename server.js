import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Tesseract from "tesseract.js";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "20mb" }));

const upload = multer({ storage: multer.memoryStorage() });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* -----------------------------
   PERSONAS
----------------------------- */
const personaPrompts = {
  "ol-goose": `
You are Ol' Goose — a grounded mentor from eastern Oklahoma.
Speak with subtle Southern warmth, calm confidence, and wisdom.
Keep responses natural and reflective, ending with a question.`,
  "sergeant-goose": `
You are Sergeant Goose — a disciplined, no-nonsense instructor.
Be direct and commanding. End each response with a challenge or action.`,
  "go-getter-goose": `
You are Go-Getter Goose — a high-energy executive coach.
Be confident, upbeat, and motivating. End with an action question.`,
};

/* -----------------------------
   RISK ANALYZER
----------------------------- */
function analyzeRisk(message) {
  const text = (message || "").toLowerCase();
  const risky = ["quit", "burn out", "burnout", "hate my job", "walk away"];
  const cautious = ["stable", "secure", "safe", "steady"];
  if (risky.some((k) => text.includes(k))) return "high";
  if (cautious.some((k) => text.includes(k))) return "low";
  return "medium";
}

/* -----------------------------
   OCR ENDPOINT
----------------------------- */
app.post("/api/ocr", upload.single("image"), async (req, res) => {
  try {
    let imageBuffer;
    if (req.body.imageBase64) {
      const base64 = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64, "base64");
    } else if (req.file) {
      imageBuffer = req.file.buffer;
    } else {
      return res.status(400).json({ error: "No image provided." });
    }

    const {
      data: { text },
    } = await Tesseract.recognize(imageBuffer, "eng");
    res.json({ extractedText: text.trim() });
  } catch (err) {
    console.error("OCR error:", err);
    res.status(500).json({ error: "Failed to process image with OCR." });
  }
});

/* -----------------------------
   CHAT ENDPOINT
----------------------------- */
app.post("/api/chat", async (req, res) => {
  const { persona, message, history } = req.body;

  try {
    const summary = (history || [])
      .map((m) => {
        const label =
          m.persona === "ol-goose"
            ? "Ol' Goose"
            : m.persona === "sergeant-goose"
            ? "Sgt. Goose"
            : "Go-Getter Goose";
        return `${label}: ${m.message}`;
      })
      .join("\n");

    const risk = analyzeRisk(message);
    const personaPrompt = `
${personaPrompts[persona]}

User risk tolerance: ${risk}
Conversation so far:
${summary || "(no previous messages)"}

Respond naturally as ${persona}.
Keep it concise and end with a guiding question.
User: "${message}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [{ role: "user", content: personaPrompt }],
    });

    const personaVoice = completion.choices[0]?.message?.content?.trim();
    if (!personaVoice) throw new Error("No text returned from OpenAI");

    const voiceModel = "gpt-4o-mini-tts";
    const voiceName =
      persona === "sergeant-goose"
        ? "onyx"
        : persona === "go-getter-goose"
        ? "verse"
        : "fable";

    const speech = await openai.audio.speech.create({
      model: voiceModel,
      voice: voiceName,
      input: personaVoice,
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const audioBase64 = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;

    res.json({ persona_voice: personaVoice, audio_url: audioBase64 });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      error: err.message,
      fallback_message:
        "Looks like I’m having trouble responding right now. Try again soon.",
    });
  }
});

/* -----------------------------
   UNIFIED JOB SEARCH (Adzuna + CareerJet)
   Query params:
     - keywords
     - location
     - category       (Adzuna category code; omit if empty)
     - sort           (friendly: newest | salary | relevance)
     - source         (adzuna | careerjet | both | all)
----------------------------- */
app.get("/api/jobs", async (req, res) => {
  const {
    keywords = "",
    location = "Oklahoma",
    category = "",
    sort = "",
    source = "all",
  } = req.query;

  const adzAppId = process.env.VITE_ADZUNA_APP_ID;
  const adzKey = process.env.VITE_ADZUNA_API_KEY;
  const cjKey = process.env.VITE_CAREERJET_API_KEY;

  // Normalize/accept both "both" and "all"
  const src = (source || "all").toLowerCase();
  const wantAdzuna = src === "adzuna" || src === "both" || src === "all";
  const wantCareerJet = src === "careerjet" || src === "both" || src === "all";

  // Map friendly sort to Adzuna's sort_by values
  // Adzuna supports: date | salary | relevance (relevancy)
  const adzunaSortMap = {
    newest: "date",
    date: "date",
    salary: "salary",
    relevance: "relevance",
    relevancy: "relevance",
  };
  const sortBy = adzunaSortMap[String(sort).toLowerCase()] || "";

  // Build Adzuna query
  const adzParams = new URLSearchParams({
    app_id: adzAppId || "",
    app_key: adzKey || "",
    results_per_page: "20",
    what: keywords,
    where: location,
  });
  if (category) adzParams.set("category", category);
  if (sortBy) adzParams.set("sort_by", sortBy);

  const adzUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?${adzParams.toString()}`;

  // Build CareerJet query (they ignore category; we pass keywords/location)
  const clientIp =
    (req.headers["x-forwarded-for"]?.toString().split(",")[0] || "").trim() ||
    req.ip ||
    "1.1.1.1";

  const cjParams = new URLSearchParams({
    locale_code: "en_US",
    keywords,
    location,
    user_ip: clientIp,
    user_agent: req.get("user-agent") || "guidance-goose",
  });
  const cjUrl = `https://search.api.careerjet.net/v4/query?${cjParams.toString()}`;

  try {
    // Fire both in parallel (only if requested)
    const tasks = [];
    if (wantAdzuna) {
      tasks.push(
        fetch(adzUrl).then(async (r) => {
          if (!r.ok) throw new Error(`Adzuna ${r.status}`);
          return r.json();
        })
      );
    } else {
      tasks.push(Promise.resolve({ results: [] }));
    }

    if (wantCareerJet) {
      tasks.push(
        fetch(cjUrl, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${cjKey || ""}:`).toString("base64")}`,
            "Content-Type": "application/json",
            Referer: "https://www.guidancegoose.com/",
          },
        }).then(async (r) => {
          if (!r.ok) throw new Error(`CareerJet ${r.status}`);
          return r.json();
        })
      );
    } else {
      tasks.push(Promise.resolve({ jobs: [] }));
    }

    const [adzData, cjData] = await Promise.allSettled(tasks).then((settled) =>
      settled.map((s, i) => {
        if (s.status === "fulfilled") return s.value;
        console.error(i === 0 ? "Adzuna error:" : "CareerJet error:", s.reason);
        return i === 0 ? { results: [] } : { jobs: [] };
      })
    );

    const adzJobs = (adzData.results || []).map((j) => ({
      title: j.title,
      company: j.company?.display_name || "",
      location: j.location?.display_name || "",
      salary: j.salary_min ? `$${Math.round(j.salary_min)}+` : "",
      date: j.created,
      url: j.redirect_url,
      source: "Adzuna",
    }));

    const cjJobs = (cjData.jobs || []).map((j) => ({
      title: j.title,
      company: j.company || "",
      location: j.locations || "",
      salary: j.salary || "",
      date: j.date,
      url: j.url,
      source: "CareerJet",
    }));

    const jobs =
      src === "adzuna"
        ? adzJobs
        : src === "careerjet"
        ? cjJobs
        : [...adzJobs, ...cjJobs].sort(
            (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
          );

    res.json({ jobs });
  } catch (err) {
    console.error("Job fetch error:", err);
    res.status(500).json({ error: "Failed to load jobs." });
  }
});

/* -----------------------------
   STATIC FRONTEND
----------------------------- */
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* -----------------------------
   START SERVER
----------------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Goose Guidance running on http://localhost:${PORT}`);
});
