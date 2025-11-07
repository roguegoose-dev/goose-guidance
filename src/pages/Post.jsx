import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// You can replace this later with Supabase or Markdown imports
const posts = {
  "career-alignment": {
    title: "Finding Career Alignment Through Reflection",
    date: "February 3, 2025",
    content: `
      The most successful people aren't just working hard — they're working *aligned*.
      Career alignment means connecting what you do with what actually energizes you.
      
      Start by asking three questions:
      1. What kind of problems do I enjoy solving?
      2. What type of environment brings out my best?
      3. How do I define progress — learning, impact, or recognition?
      
      Ol’ Goose says: “If you can name it, you can navigate it.” So name your motivators — and plan from there.
    `,
  },
  "data-analytics-path": {
    title: "Becoming a Data Analyst: The 2025 Roadmap",
    date: "January 15, 2025",
    content: `
      The data field has never been more open — or more competitive.
      Start by mastering SQL, Python, and data visualization tools like Tableau or Power BI.
      
      Once you have technical skills, focus on *storytelling with data*.
      Decision-makers care about insights, not spreadsheets.
      
      Sgt. Goose reminds you: “Precision first, polish second.” Keep your dashboards simple, clean, and purposeful.
    `,
  },
  "burnout-recovery": {
    title: "Burnout Recovery for High Performers",
    date: "December 12, 2024",
    content: `
      Burnout isn't failure — it's feedback. 
      It’s your body and mind telling you something about your limits.
      
      Wellness Goose recommends:
      - Take three full nights of recovery sleep.
      - Hydrate, stretch, and do light cardio.
      - Reflect on what boundaries you’ve let slide.
      
      You can’t pour from an empty bucket — refill before you restart.
    `,
  },
};

export default function Post() {
  const { id } = useParams();
  const post = posts[id];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="text-blue-600 hover:underline text-sm">
            ← Back to Blog
          </Link>
          <h1 className="text-4xl font-bold mb-2 text-blue-700">{post.title}</h1>
          <p className="text-gray-500 mb-6">{post.date}</p>
          <div className="prose prose-blue max-w-none whitespace-pre-line text-gray-800">
            {post.content}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
