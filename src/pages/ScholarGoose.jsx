// src/pages/ScholarGoose.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ScholarGoose() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-indigo-700">Scholar Goose</h1>
          <p className="text-gray-700 mb-6">
            Coming soon: upload program tiles or screenshots, auto-extract text with OCR, and get
            ranked recommendations on programs, scholarships, and FAFSA steps.
          </p>
          <div className="rounded border-2 border-dashed border-indigo-300 p-6 text-center">
            <p className="text-indigo-800">Drag & drop screenshots here (future)</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
