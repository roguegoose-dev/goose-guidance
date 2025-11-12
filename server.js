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
      const base64 = req.body.imageBase64.replace(/^data:image\/\\w+;base64,/, "");
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

  const cjUrl = `https://search.api.careerjet.net/v4/query?${new URLSearchParams({
    locale_code: "en_US",
    keywords,
    location,
    user_ip: req.ip || "1.1.1.1",
    user_agent: req.get("user-agent") || "guidance-goose",
  })}`;

  const adzUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${adzAppId}&app_key=${adzKey}&results_per_page=20&what=${encodeURIComponent(
    keywords
  )}&where=${encodeURIComponent(location)}&category=${encodeURIComponent(
    category
  )}&sort_by=${encodeURIComponent(sort)}`;

  try {
    let adzJobs = [],
      cjJobs = [];

    if (source === "adzuna" || source === "all") {
      const adzRes = await fetch(adzUrl);
      if (adzRes.ok) {
        const data = await adzRes.json();
        adzJobs = (data.results || []).map((j) => ({
          title: j.title,
          company: j.company?.display_name,
          location: j.location?.display_name,
          salary: j.salary_min ? `$${Math.round(j.salary_min)}+` : "",
          date: j.created,
          url: j.redirect_url,
          source: "Adzuna",
        }));
      }
    }

    if (source === "careerjet" || source === "all") {
      const cjRes = await fetch(cjUrl, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${cjKey}:`).toString("base64")}`,
          "Content-Type": "application/json",
          Referer: "https://www.guidancegoose.com/",
        },
      });
      if (cjRes.ok) {
        const data = await cjRes.json();
        cjJobs = (data.jobs || []).map((j) => ({
          title: j.title,
          company: j.company,
          location: j.locations,
          salary: j.salary,
          date: j.date,
          url: j.url,
          source: "CareerJet",
        }));
      }
    }

    const jobs = [...adzJobs, ...cjJobs].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
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
