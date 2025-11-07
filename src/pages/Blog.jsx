import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Example blog posts (can later come from Supabase, Markdown, etc.)
const posts = [
  {
    id: "career-alignment",
    title: "Finding Career Alignment Through Reflection",
    date: "February 3, 2025",
    summary:
      "How to identify work that matches your personal values, energy, and long-term goals.",
    image: "/images/blog-career.jpg",
  },
  {
    id: "data-analytics-path",
    title: "Becoming a Data Analyst: The 2025 Roadmap",
    date: "January 15, 2025",
    summary:
      "An updated walkthrough of the skills, certifications, and mindsets that get you hired in analytics.",
    image: "/images/blog-analytics.jpg",
  },
  {
    id: "burnout-recovery",
    title: "Burnout Recovery for High Performers",
    date: "December 12, 2024",
    summary:
      "A grounded guide from Sgt. Goose and Wellness Goose on resetting discipline and self-care.",
    image: "/images/blog-burnout.jpg",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-blue-700">Guidance Goose Blog</h1>
          <p className="text-gray-700 mb-10">
            Insight, reflection, and stories from the world of growth, data, and discipline.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg transition-all overflow-hidden"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2 text-blue-700">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">{post.date}</p>
                  <p className="text-gray-700 mb-4">{post.summary}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
