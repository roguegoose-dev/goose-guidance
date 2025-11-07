import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Tesseract from "tesseract.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "20mb" })); // bump limit for base64 uploads

// Handle multipart/form uploads
const upload = multer({ storage: multer.memoryStorage() });

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* -----------------------------------------------------------
   PERSONA DEFINITIONS
----------------------------------------------------------- */
const personaPrompts = {
  "ol-goose": `
You are Ol' Goose — a grounded mentor from eastern Oklahoma.
Speak with a subtle Southern warmth — calm, confident, and full of life experience.
Sound like an older man who’s lived a little: slow cadence, clear tone, just a touch of twang.
Keep sentences short and natural, like friendly porch talk.
Use gentle humor and grounded wisdom, not slang or exaggeration.
Always end with one guiding question that helps the user reflect.
Example tone: “Well now, that’s a fair thought. Let’s figure what makes sense before you jump.”
`,

  "sergeant-goose": `
You are Sergeant Goose — a disciplined instructor cut from the same cloth as Gunnery Sergeant Hartman.
Your tone is clipped, direct, and commanding — every sentence matters.
Push the user to face truth and act with discipline.
Avoid filler words and long paragraphs. Stay sharp, concise, and focused.
Always end with a decisive question or challenge.
Example tone: “You’re talking about walking away from stability for a gamble. That’s not courage yet — it’s impulse. What’s your plan to earn the right to make that leap?”
`,

  "go-getter-goose": `
You are Go-Getter Goose — an upbeat business-minded motivator.
Speak like a sharp executive coach or consultant.
Your tone is quick, confident, and focused on forward motion.
Turn problems into opportunities and excuses into plans.
Always end with a motivating, action-oriented question.
Example tone: “Alright — if you’re ready to pivot, then pivot with purpose. What timeline makes this move realistic instead of reckless?”
`
};

/* -----------------------------------------------------------
   BASIC RISK ANALYZER
----------------------------------------------------------- */
function analyzeRisk(message) {
  const m = (message || "").toLowerCase();
  const risky = ["quit", "burn out", "burnout", "hate my job", "start over", "change everything", "blow it up", "walk away"];
  const cautious = ["stable", "secure", "steady", "safe", "risk averse", "risk-averse"];
  if (risky.some(k => m.includes(k))) return "high";
  if (cautious.some(k => m.includes(k))) return "low";
  return "medium";
}

/* -----------------------------------------------------------
   OCR ENDPOINT
----------------------------------------------------------- */
app.post("/api/ocr", upload.single("image"), async (req, res) => {
  try {
    let imageBuffer;

    // handle base64 or uploaded file
    if (req.body.imageBase64) {
      const base64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    } else if (req.file) {
      imageBuffer = req.file.buffer;
    } else {
      return res.status(400).json({ error: "No image provided." });
    }

    console.log("🧠 Running OCR on uploaded image...");
    const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng");
    console.log("✅ OCR text extracted:", text.trim().slice(0, 120));

    res.json({ extractedText: text.trim() });
  } catch (err) {
    console.error("❌ OCR error:", err);
    res.status(500).json({ error: "Failed to process image with OCR." });
  }
});

/* -----------------------------------------------------------
   MAIN CHAT ENDPOINT
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

User risk tolerance (rough estimate): ${risk}

Conversation so far:
${conversationSummary || "(no previous messages)"}

Respond naturally as ${persona}, in your own tone.
Keep it short, helpful, and always end with a guiding or reflective question.
User: "${message}"
`;

    console.log("📨 Sending prompt to OpenAI...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [{ role: "user", content: personaPrompt }],
    });

    const persona_voice = response.choices[0]?.message?.content?.trim();
    console.log("✅ OpenAI replied:", persona_voice?.slice(0, 120) || "(no text)");

    if (!persona_voice) throw new Error("No text returned from OpenAI");

    const voiceModel = "gpt-4o-mini-tts";
    const voiceName =
      persona === "sergeant-goose"
        ? "onyx"
        : persona === "go-getter-goose"
        ? "verse"
        : "fable";

    console.log(`🎤 Generating voice with ${voiceName}`);
    const speech = await openai.audio.speech.create({
      model: voiceModel,
      voice: voiceName,
      input: persona_voice,
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const audioBase64 = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;

    res.json({ persona_voice, audio_url: audioBase64 });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({
      error: err.message,
      fallback_message: "Well now, looks like I’m having trouble speaking up. Try again in a bit.",
    });
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
app.listen(PORT, () => {
  console.log(`🚀 Goose Guidance server running on http://localhost:${PORT}`);
});
