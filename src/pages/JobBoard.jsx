import { useState } from "react";
import Header from "../components/Header";

export default function JobBoard() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Oklahoma");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [source, setSource] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        keywords: keyword,
        location,
        category,
        sort: sortBy,
        source,
      }).toString();

      const response = await fetch(`/api/jobs?${query}`);
      if (!response.ok) throw new Error(`Server error ${response.status}`);

      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Job fetch failed:", err);
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
      <Header />
      <div className="max-w-6xl mx-auto py-10 px-4 text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">Job Board</h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Keyword or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="text"
            placeholder="City or state"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-600"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm text-gray-700"
          >
            <option value="">All Categories</option>
            <option value="it-jobs">IT / Tech</option>
            <option value="healthcare-nursing-jobs">Healthcare</option>
            <option value="teaching-jobs">Education</option>
            <option value="engineering-jobs">Engineering</option>
            <option value="sales-jobs">Sales</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm text-gray-700"
          >
            <option value="">Sort by Relevance</option>
            <option value="date">Newest</option>
            <option value="salary">Highest Salary</option>
          </select>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-white"
          >
            <option value="all">All Sources</option>
            <option value="adzuna">Adzuna Only</option>
            <option value="careerjet">CareerJet Only</option>
          </select>
          <button
            type="submit"
            className="md:col-span-5 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Loading / Error */}
        {loading && <p className="text-center text-gray-600">Loading jobs...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Job Results */}
        <div className="grid gap-4">
          {jobs.slice(0, 20).map((job, i) => (
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
              <p className="text-sm text-gray-800 font-medium mt-1">
                {job.company}
              </p>
              <p className="text-sm text-gray-600">{job.location}</p>
              {job.salary && (
                <p className="text-sm text-green-700 font-medium">
                  {job.salary}
                </p>
              )}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{job.source}</span>
                {job.date && (
                  <span>{new Date(job.date).toLocaleDateString()}</span>
                )}
              </div>
            </a>
          ))}
        </div>

        {!loading && !error && jobs.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No jobs found. Try adjusting your filters.
          </p>
        )}
      </div>
    </>
  );
}
