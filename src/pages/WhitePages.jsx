// src/pages/WhitePages.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function WhitePages() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">White Pages</h1>
          <p className="text-gray-700 mb-8">
            A growing library of Goose-written essays, reports, and thought pieces exploring
            technology, guidance, leadership, and AI ethics. Each entry aims to simplify
            complex topics and connect them back to human decision-making.
          </p>

          <section className="space-y-6">
            <div className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-1">
                <a href="#" className="text-blue-700 hover:underline">
                  The Future of Mentorship in the Age of AI
                </a>
              </h2>
              <p className="text-sm text-gray-600 mb-2">Published: June 2025</p>
              <p className="text-gray-800">
                How conversational models are reshaping mentorship, learning, and leadership —
                and what we can do to keep humanity at the center.
              </p>
            </div>

            <div className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-1">
                <a href="#" className="text-blue-700 hover:underline">
                  Building Trustworthy AI Companions
                </a>
              </h2>
              <p className="text-sm text-gray-600 mb-2">Published: May 2025</p>
              <p className="text-gray-800">
                A practical breakdown of what it means to build guidance tools that listen, respect,
                and adapt — without crossing ethical lines.
              </p>
            </div>

            <div className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-1">
                <a href="#" className="text-blue-700 hover:underline">
                  Human Reflection at Machine Speed
                </a>
              </h2>
              <p className="text-sm text-gray-600 mb-2">Published: April 2025</p>
              <p className="text-gray-800">
                A short essay on how AI can slow us down — by helping us think better, not faster.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
