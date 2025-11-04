import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [persona, setPersona] = useState("ol-goose");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const geese = [
    {
      id: "ol-goose",
      name: "Ol' Goose",
      desc: "The empathetic mentor. Calm, wise, and understanding.",
      img: "/images/olgoose.png",
      bg: "bg-yellow-50 border-yellow-300",
    },
    {
      id: "sergeant-goose",
      name: "Sgt. Goose",
      desc: "The blunt truth-teller. Tough love, no fluff.",
      img: "/images/sergeantgoose.png",
      bg: "bg-red-50 border-red-300",
    },
    {
      id: "go-getter-goose",
      name: "Go-Getter Goose",
      desc: "The motivator. High energy, all gas no brakes.",
      img: "/images/gogettergoose.png",
      bg: "bg-blue-50 border-blue-300",
    },
  ];

  // Load browser voices once (useful if you later want fallback TTS)
  useEffect(() => {
    const loadVoices = () => window.speechSynthesis?.getVoices?.();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMsg = { role: "user", persona, message: input };
    setHistory((prev) => [newUserMsg, ...prev]);
    setInput("");
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
        const audio = new Audio(res.data.audio_url);
        audio.play();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.start();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-700">Choose Your Goose</h1>

      {/* Goose Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
        {geese.map((g) => (
          <div
            key={g.id}
            onClick={() => setPersona(g.id)}
            className={`cursor-pointer border-2 rounded-xl p-4 shadow hover:shadow-lg transition-all text-center ${
              persona === g.id ? "ring-4 ring-blue-400" : ""
            } ${g.bg}`}
          >
            <img
              src={g.img}
              alt={g.name}
              className="w-28 h-28 mx-auto rounded-full object-cover mb-3"
            />
            <h3 className="font-bold text-lg">{g.name}</h3>
            <p className="text-sm text-gray-600">{g.desc}</p>
          </div>
        ))}
      </div>

      {/* Input Row */}
      <div className="flex w-full max-w-xl gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Ask Goose about your career..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          onClick={startListening}
          title="Voice Input"
        >
          🎙
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>

      {/* Conversation History (Newest on Top) */}
      <div className="w-full max-w-3xl mt-10 space-y-6">
        {history.map((msg, idx) => (
          <div key={idx}>
            {msg.role === "user" ? (
              <div className="bg-blue-100 border-l-4 border-blue-400 p-3 rounded">
                <strong>
                  {geese.find((g) => g.id === msg.persona)?.name}:
                </strong>{" "}
                {msg.message}
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <strong>
                  {geese.find((g) => g.id === msg.persona)?.name}:
                </strong>
                <p className="mt-1 text-gray-800 whitespace-pre-line">
                  {msg.message}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
