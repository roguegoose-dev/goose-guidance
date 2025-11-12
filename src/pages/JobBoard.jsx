// src/pages/JobBoard.jsx
import { useState } from "react";
import Header from "../components/Header"; // <-- add your site nav

export default function JobBoard() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Oklahoma");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch jobs from your backend proxy (server.js handles CareerJet)
  const fetchJobs = async (keywords = keyword, loc = location) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/jobs?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(loc)}`
      );
      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const data = await response.json();
      setJobs(data?.jobs ?? []);
    } catch (err) {
      console.error("❌ Job fetch failed:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <>
      {/* Top navigation */}
      <Header />

      {/* Page body */}
      <div className="max-w-5xl mx-auto py-10 px-4 text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">Job Board</h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4 mb-8 justify-center"
        >
          <input
            type="text"
            placeholder="Job title, keywords or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded-md px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="City or state"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded-md px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Loading / Error States */}
        {loading && <p className="text-center text-gray-600">Loading jobs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Job Listings */}
        <div className="grid gap-4">
          {jobs.slice(0, 10).map((job, i) => (
            <a
              key={i}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-blue-700 hover:underline">
                {job.title}
              </h2>
              {job.company && (
                <p className="text-sm text-gray-800 font-medium mt-1">
                  {job.company}
                </p>
              )}
              {job.locations && (
                <p className="text-sm text-gray-600">{job.locations}</p>
              )}
              {job.salary && (
                <p className="text-sm text-green-600 font-medium">💵 {job.salary}</p>
              )}
              {job.date && (
                <p className="text-xs text-gray-500 mt-1">
                  Posted: {new Date(job.date).toLocaleDateString()}
                </p>
              )}
            </a>
          ))}
        </div>

        {/* Empty State */}
        {!loading && jobs.length === 0 && !error && (
          <p className="text-center text-gray-500 mt-8">
            No jobs found. Try adjusting your search.
          </p>
        )}
      </div>
    </>
  );
}
