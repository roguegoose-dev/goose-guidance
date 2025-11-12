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

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* -----------------------------------------------------------
   PERSONAS
----------------------------------------------------------- */
const personaPrompts = {
  "ol-goose": `
You are Ol' Goose — a grounded mentor from eastern Oklahoma.
Speak with subtle Southern warmth — calm, confident, and wise.
Keep sentences short and natural. Use gentle humor and grounded wisdom.
Always end with a reflective question.
`,

  "sergeant-goose": `
You are Sergeant Goose — a disciplined, no-nonsense instructor.
Speak directly and command attention. Be sharp and decisive.
End every response with a challenge or action-based question.
`,

  "go-getter-goose": `
You are Go-Getter Goose — a high-energy executive coach.
Be confident, fast-paced, and motivating.
Turn excuses into plans and end with an action question.
`,
};

/* -----------------------------------------------------------
   RISK ANALYZER
----------------------------------------------------------- */
function analyzeRisk(message) {
  const m = (message || "").toLowerCase();
  const risky = ["quit", "burn out", "burnout", "hate my job", "walk away"];
  const cautious = ["stable", "secure", "safe", "steady"];
  if (risky.some((k) => m.includes(k))) return "high";
  if (cautious.some((k) => m.includes(k))) return "low";
  return "medium";
}

/* -----------------------------------------------------------
   OCR ENDPOINT
----------------------------------------------------------- */
app.post("/api/ocr", upload.single("image"), async (req, res) => {
  try {
    let imageBuffer;
    if (req.body.imageBase64) {
      const base64Data = req.body.imageBase64.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      imageBuffer = Buffer.from(base64Data, "base64");
    } else if (req.file) {
      imageBuffer = req.file.buffer;
    } else {
      return res.status(400).json({ error: "No image provided." });
    }

    console.log("🧠 Running OCR on uploaded image...");
    const {
      data: { text },
    } = await Tesseract.recognize(imageBuffer, "eng");
    res.json({ extractedText: text.trim() });
  } catch (err) {
    console.error("❌ OCR error:", err);
    res.status(500).json({ error: "Failed to process image with OCR." });
  }
});

/* -----------------------------------------------------------
   CHAT ENDPOINT
----------------------------------------------------------- */
app.post("/api/chat", async (req, res) => {
  const { persona, message, history } = req.body;
  console.log(`🪶 Persona: ${persona} | Message: ${message}`);

  try {
    const conversationSummary = (history || [])
      .map((msg) => {
        const label =
          msg.persona === "ol-goose"
            ? "Ol' Goose"
            : msg.persona === "sergeant-goose"
            ? "Sgt. Goose"
            : "Go-Getter Goose";
        return `${label}: ${msg.message}`;
      })
      .join("\n");

    const risk = analyzeRisk(message);
    const personaPrompt = `
${personaPrompts[persona]}

User risk tolerance: ${risk}
Conversation so far:
${conversationSummary || "(no previous messages)"}

Respond naturally as ${persona}.
Keep it concise, helpful, and end with a guiding question.
User: "${message}"
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [{ role: "user", content: personaPrompt }],
    });

    const persona_voice = response.choices[0]?.message?.content?.trim();
    if (!persona_voice) throw new Error("No text returned from OpenAI");

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
      input: persona_voice,
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const audioBase64 = `data:audio/mpeg;base64,${audioBuffer.toString(
      "base64"
    )}`;

    res.json({ persona_voice, audio_url: audioBase64 });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({
      error: err.message,
      fallback_message:
        "Well now, looks like I’m having trouble speaking up. Try again in a bit.",
    });
  }
});

/* -----------------------------------------------------------
   CAREERJET JOB SEARCH
----------------------------------------------------------- */
app.get("/api/jobs", async (req, res) => {
  const { keywords = "", location = "Oklahoma" } = req.query;
  const API_HOSTNAME = "search.api.careerjet.net";
  const API_SEARCH_PATH = "/v4/query";
  const API_KEY = process.env.CAREERJET_API_KEY;

  const params = new URLSearchParams({
    locale_code: "en_US",
    keywords,
    location,
    user_ip: req.ip || "1.1.1.1",
    user_agent: req.get("user-agent") || "guidance-goose",
  }).toString();

  const headers = new Headers();
  headers.set(
    "Authorization",
    `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`
  );
  headers.set("Content-Type", "application/json");
  headers.set("Referer", "https://www.guidancegoose.com/");

  try {
    const response = await fetch(
      `https://${API_HOSTNAME}${API_SEARCH_PATH}?${params}`,
      { method: "GET", headers }
    );

    if (!response.ok) throw new Error(`CareerJet API error ${response.status}`);

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ CareerJet error:", err);
    res.status(500).json({ error: "Failed to load jobs." });
  }
});

/* -----------------------------------------------------------
   STATIC FRONTEND
----------------------------------------------------------- */
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* -----------------------------------------------------------
   START SERVER
----------------------------------------------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Goose Guidance running on http://localhost:${PORT}`)
);
