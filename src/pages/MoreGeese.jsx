// src/pages/MoreGeese.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function MoreGeese() {
  const specialtyGeese = [
    {
      id: "resume-goose",
      name: "Resume Goose",
      desc: "Professional writing assistant who crafts resumes, cover letters, and LinkedIn summaries that sound like you — just sharper.",
      color: "bg-purple-50 border-purple-300 text-purple-900",
      img: "/images/resumegoose.png",
      path: "/resume-goose",
    },
    {
      id: "scholar-goose",
      name: "Scholar Goose",
      desc: "Your nerdy guide for navigating college programs, scholarships, and FAFSA — breaks it down so you don’t drown in paperwork.",
      color: "bg-indigo-50 border-indigo-300 text-indigo-900",
      img: "/images/scholargoose.png",
      path: "/scholar-goose",
    },
    {
      id: "wellness-goose",
      name: "Wellness Goose",
      desc: "Balances discipline and self-care — helps you build routines for sleep, stress, and study that actually stick.",
      color: "bg-emerald-50 border-emerald-300 text-emerald-900",
      img: "/images/wellnessgoose.png",
      path: "/wellness-goose",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-blue-700">Meet More Geese</h1>
          <p className="text-gray-700 mb-10 max-w-2xl">
            Guidance Goose has friends — each trained for a specific mission. 
            Pick a Goose below to get specialized advice or tools for your next move.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialtyGeese.map((g) => (
              <div
                key={g.id}
                className={`border-2 rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center ${g.color}`}
              >
                <img
                  src={g.img}
                  alt={`${g.name} avatar`}
                  className="w-28 h-28 mx-auto rounded-full object-cover mb-4 transition-transform duration-200 hover:scale-105"
                />
                <h3 className="font-bold text-xl mb-2">{g.name}</h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{g.desc}</p>
                <Link
                  to={g.path}
                  className="inline-block bg-blue-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Talk to {g.name.split(" ")[0]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
