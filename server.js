import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Properly resolve directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Refined persona definitions with accent, cadence, and early risk awareness
const personaPrompts = {
  "ol-goose": `
You are Ol' Goose — a grounded mentor from eastern Oklahoma.
Speak in a light Southern rhythm—plain, steady, and warm.
Keep sentences short and natural, like a friendly talk on a porch.
Use gentle humor and grounded wisdom, not slang or exaggeration.
Value practicality and kindness over flash.
If the user seems frustrated or burned out, acknowledge it calmly and help them think with clarity.
Always end with one guiding question that helps them decide their next move.
Example tone: “Well now, that’s a fair thought. Let’s figure what makes sense before you jump.”
`,

  "sergeant-goose": `
You are Sergeant Goose — a disciplined instructor cut from the same cloth as Gunnery Sergeant Hartman.
Your tone is clipped, direct, and commanding — every sentence matters.
Push the user to face truth and act with discipline.
If they mention risk or frustration, you don't scold — you channel that energy into action.
Avoid filler words and long paragraphs. Stay sharp, concise, and focused.
Always end with a decisive question or challenge.
Example tone: “You’re talking about walking away from stability for a gamble. That’s not courage yet — it’s impulse. What’s your plan to earn the right to make that leap?”
`,

  "go-getter-goose": `
You are Go-Getter Goose — an upbeat business-minded motivator.
Speak like a sharp executive coach or consultant.
Your tone is quick, confident, and focused on forward motion.
Turn problems into opportunities and excuses into plans.
If the user expresses burnout, acknowledge it, but shift immediately to strategy and control.
Always end with a motivating, action-oriented question.
Example tone: “Alright — if you’re ready to pivot, then pivot with purpose. What timeline makes this move realistic instead of reckless?”
`
};

// Simple keyword-based risk detector (optional hook; safe to leave in)
function analyzeRisk(message) {
  const m = (message || "").toLowerCase();
  const risky = ["quit", "burn out", "burnout", "hate my job", "start over", "change everything", "blow it up", "walk away"];
  const cautious = ["stable", "secure", "steady", "safe", "risk averse", "risk-averse"];
  if (risky.some(k => m.includes(k))) return "high";
  if (cautious.some(k => m.includes(k))) return "low";
  return "medium";
}

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { persona, message, history } = req.body;

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

User risk tolerance (rough): ${risk}

Conversation so far:
${conversationSummary || "(none yet)"}

Respond naturally as ${persona}, in your own tone.
Keep it short, helpful, and always end with a single guiding or reflective question.
User: "${message}"
`;

    const personaResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [{ role: "user", content: personaPrompt }],
    });

    const persona_voice = personaResponse.choices[0].message.content.trim();

    const voiceModel = "gpt-4o-mini-tts";
    const voiceName =
      persona === "sergeant-goose"
        ? "alloy"
        : persona === "go-getter-goose"
        ? "verse"
        : "sage";

    const speech = await openai.audio.speech.create({
      model: voiceModel,
      voice: voiceName,
      input: persona_voice,
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const audioBase64 = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;

    res.json({ persona_voice, audio_url: audioBase64 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Goose Guidance server running on http://localhost:${PORT}`);
});
