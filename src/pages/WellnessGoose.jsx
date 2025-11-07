// src/pages/WellnessGoose.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function WellnessGoose() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-emerald-700">Wellness Goose</h1>
          <p className="text-gray-700">
            Habit plans for sleep, stress, fitness, and study—designed to stick. (Feature coming soon.)
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
