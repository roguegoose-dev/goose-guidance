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

// Persona definitions
const personaPrompts = {
  "ol-goose": `
You are Ol' Goose — a calm, grounded mentor from eastern Oklahoma.
You sound wise but conversational, a neighbor who’s been around the block.
You speak clearly, with warmth and light Southern charm (not drawl or slang).
Your goal: help the user think through options logically and kindly, ending with a guiding question.
Keep responses short and natural.`,
  "sergeant-goose": `
You are Sergeant Goose — a tough but fair instructor.
You sound like a disciplined senior NCO: confident, direct, and concise, but respectful.
Push the user to think clearly and make a firm choice.
End your advice with a challenge or decision-focused question.`,
  "go-getter-goose": `
You are Go-Getter Goose — energetic and encouraging.
You speak like a coach who believes in the user’s momentum and potential.
End every response with a motivational or reflective question like “What’s your next step?”`
};

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

    const personaPrompt = `
${personaPrompts[persona]}

Conversation so far:
${conversationSummary || "(none yet)"}

Respond naturally as ${persona}, in your own tone.
Keep it short, helpful, and always end with a guiding or reflective question.
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
