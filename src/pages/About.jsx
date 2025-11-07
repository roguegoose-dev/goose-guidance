// src/pages/About.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">About Guidance Goose</h1>
          <p className="text-gray-700 mb-6">
            Guidance Goose is an AI-powered mentor designed to help you think clearly, act
            deliberately, and move toward meaningful goals — whether that’s career, education,
            or self-development.
          </p>

          <section className="space-y-6 text-gray-800 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
              <p>
                We believe good guidance is about clarity, not complexity. Guidance Goose exists
                to make reflection and direction accessible to anyone — through practical dialogue,
                structured insight, and a touch of humor.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">The Geese</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Ol’ Goose</span> — the calm mentor with old-school
                  wisdom.
                </li>
                <li>
                  <span className="font-medium">Sgt. Goose</span> — the tough-love instructor who
                  cuts straight to the truth.
                </li>
                <li>
                  <span className="font-medium">Go-Getter Goose</span> — the energetic motivator who
                  keeps you charging forward.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Technology</h2>
              <p>
                Guidance Goose uses modern AI models for text and voice synthesis, integrated with
                a custom interface built in React and Node.js. The system learns from patterns in
                dialogue to improve tone, pacing, and coaching style — while never storing sensitive
                personal data.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Built by Goose Solutions</h2>
              <p>
                Guidance Goose is a project by{" "}
                <a
                  href="https://marvinlarsen.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline"
                >
                  Goose Solutions
                </a>
                , a creative development studio blending technology, mentorship, and design.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
