// src/pages/ResumeGoose.jsx
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

export default function ResumeGoose() {
  const [form, setForm] = useState({
    name: "",
    targetRole: "",
    summaryHints: "",
    skills: "",
    bullets: "",
  });
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generate = async () => {
    setLoading(true);
    setOut("");

    // Compose a single prompt that your /api/chat can use with a known persona
    const prompt = `
Act as a senior resume writer. Create a crisp, impact-focused professional summary (5–7 sentences) and 6–8 bullet points for ${form.name || "the candidate"} targeting: "${form.targetRole || "the role"}".
Use strong verbs, measurable outcomes when possible, and keep it ATS-friendly.
Skills to emphasize: ${form.skills || "(user will add)"}.
Experience highlights to reflect:
${form.bullets || "(user will add)"}.
Tone: confident, concise, and professional.
Also include a short "Core Skills" line at the end (comma-separated).
If provided, weave in context: ${form.summaryHints || "(none)"}.
`;

    try {
      const res = await axios.post("/api/chat", {
        persona: "go-getter-goose", // good writing tone
        message: prompt,
        history: [],
      });
      setOut(res.data.persona_voice || "");
    } catch (e) {
      setOut("Error generating resume content.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-purple-700">Resume Goose</h1>
          <p className="text-gray-700 mb-6">
            Fill this out and Resume Goose will draft a sharp, ATS-friendly summary + bullet points.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="border p-2 rounded"
              placeholder="Your name"
            />
            <input
              name="targetRole"
              value={form.targetRole}
              onChange={onChange}
              className="border p-2 rounded"
              placeholder="Target role (e.g., Integration Engineer)"
            />
            <input
              name="skills"
              value={form.skills}
              onChange={onChange}
              className="border p-2 rounded md:col-span-2"
              placeholder="Key skills to emphasize (comma-separated)"
            />
            <textarea
              name="bullets"
              value={form.bullets}
              onChange={onChange}
              className="border p-2 rounded h-28 md:col-span-2"
              placeholder="Experience highlights or bullet ideas (one per line)"
            />
            <textarea
              name="summaryHints"
              value={form.summaryHints}
              onChange={onChange}
              className="border p-2 rounded h-20 md:col-span-2"
              placeholder="Any tone or context notes you want it to include"
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Writing…" : "Generate Resume Draft"}
          </button>

          {out && (
            <div className="mt-6 bg-white border rounded p-4 shadow-sm whitespace-pre-wrap">
              {out}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
