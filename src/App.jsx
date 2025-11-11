import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { supabase } from "./lib/supabase";

export default function App() {
  const navigate = useNavigate();

  // 🔐 Auth State
  const [user, setUser] = useState(null);

  // 🧠 Chat State
  const [persona, setPersona] = useState("ol-goose");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [ocrText, setOcrText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // 🦢 Persona profiles
  const geese = [
    {
      id: "ol-goose",
      name: "Ol' Goose",
      desc: "The empathetic mentor. Calm, wise, and understanding.",
      img: "/images/olgoose.png",
      cardBg: "bg-yellow-50 border-yellow-300",
      ring: "ring-yellow-300",
      bubbleBg: "bg-yellow-50",
      bubbleBorder: "border-yellow-500",
      nameColor: "text-yellow-900",
    },
    {
      id: "sergeant-goose",
      name: "Sgt. Goose",
      desc: "The blunt truth-teller. Tough love, no fluff.",
      img: "/images/sergeantgoose.png",
      cardBg: "bg-green-50 border-green-300",
      ring: "ring-green-400",
      bubbleBg: "bg-green-50",
      bubbleBorder: "border-green-600",
      nameColor: "text-green-900",
    },
    {
      id: "go-getter-goose",
      name: "Go-Getter Goose",
      desc: "The motivator. High energy, all gas no brakes.",
      img: "/images/gogettergoose.png",
      cardBg: "bg-blue-50 border-blue-300",
      ring: "ring-blue-400",
      bubbleBg: "bg-blue-50",
      bubbleBorder: "border-blue-600",
      nameColor: "text-blue-900",
    },
  ];

  const byPersona = (pid, key) =>
    (geese.find((g) => g.id === pid) || geese[0])[key];

  // 🔐 Check for Supabase session on load
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) navigate("/signin");
      else setUser(data.user);
    };
    initAuth();

    // Real-time session listener
    const { data: listener } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!session?.user) navigate("/signin");
      else setUser(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // 🎙 Voice synthesis setup
  useEffect(() => {
    const loadVoices = () => window.speechSynthesis?.getVoices?.();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  // 💬 Chat logic
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newUserMsg = { role: "user", persona, message: input };
    setHistory((prev) => [newUserMsg, ...prev]);
    setInput("");
    setOcrText("");
    setImagePreview(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", {
        persona,
        message: newUserMsg.message,
        history,
      });

      const newReply = {
        role: "assistant",
        persona,
        message: res.data.persona_voice,
        audio: res.data.audio_url,
      };

      setHistory((prev) => [newReply, ...prev]);

      if (res.data.audio_url) {
        new Audio(res.data.audio_url).play();
      }
    } catch (err) {
      console.error("❌ Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📷 OCR handler
  const handleImageUpload = async (file) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/api/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const text = res.data.extractedText || "";
      setOcrText(text);
      setInput(text);
    } catch (err) {
      console.error("❌ OCR error:", err);
      setOcrText("Failed to read image text.");
    } finally {
      setLoading(false);
    }
  };

  // 🎙 Voice input
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  // 💾 File drop handler
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  // ⌨️ Send on Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 🧩 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };

  if (!user) return null; // prevents flicker before redirect

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50 text-gray-900"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Header />

      <main className="flex-1 flex flex-col items-center p-6">
        <div className="w-full flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-blue-700">Choose Your Goose</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 border border-red-300"
          >
            Sign Out
          </button>
        </div>

        {/* Goose cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
          {geese.map((g) => (
            <div
              key={g.id}
              onClick={() => setPersona(g.id)}
              className={`cursor-pointer border-2 rounded-xl p-4 shadow hover:shadow-lg transition-all text-center
              ${g.cardBg} ${persona === g.id ? `ring-4 ${g.ring}` : ""}`}
            >
              <img
                src={g.img}
                alt={g.name}
                className="w-28 h-28 mx-auto rounded-full object-cover mb-3"
              />
              <h3 className="font-bold text-lg">{g.name}</h3>
              <p className="text-sm text-gray-700">{g.desc}</p>
            </div>
          ))}
        </div>

        {/* Input Row */}
        <div className="flex w-full max-w-xl gap-2 items-start">
          <textarea
            className="flex-1 border p-2 rounded resize-none h-28"
            placeholder="Ask Goose about your career... (Shift+Enter for newline)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex flex-col gap-2">
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={startListening}
              title="Voice Input"
            >
              🎙
            </button>
            <label className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer text-center">
              📷
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </label>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="mt-4 text-center">
            <img
              src={imagePreview}
              alt="Uploaded preview"
              className="max-h-48 mx-auto rounded shadow"
            />
            <p className="text-xs text-gray-500 mt-1">(OCR text auto-added)</p>
          </div>
        )}

        {/* History */}
        <div className="w-full max-w-3xl mt-10 overflow-y-auto h-[60vh] border-t border-gray-300 pt-4 px-2 rounded-lg bg-white shadow-inner">
          {history.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.role === "user"
                  ? "bg-blue-100 border-l-4 border-blue-400 p-3 rounded mb-3"
                  : `${byPersona(msg.persona, "bubbleBg")} border-l-4 ${byPersona(
                      msg.persona,
                      "bubbleBorder"
                    )} p-4 rounded mb-3`
              }
            >
              <strong className={byPersona(msg.persona, "nameColor")}>
                {byPersona(msg.persona, "name")}:
              </strong>
              <p className="mt-1 text-gray-900 whitespace-pre-line">
                {msg.message}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/more-geese")}
          className="mt-8 w-full max-w-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 rounded-lg border border-blue-300 transition"
        >
          🪶 Meet More Geese
        </button>
      </main>

      <Footer />
    </div>
  );
}
