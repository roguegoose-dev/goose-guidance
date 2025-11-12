// src/pages/JobBoard.jsx
import { useState } from "react";

export default function JobBoard() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Oklahoma");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_HOSTNAME = "search.api.careerjet.net";
  const API_SEARCH_PATH = "/v4/query";
  const API_KEY = import.meta.env.VITE_CAREERJET_API_KEY;

  const fetchJobs = async (keywords = keyword, loc = location) => {
    setLoading(true);
    setError(null);
    try {
      const PARAMS = {
        locale_code: "en_US",
        keywords,
        location: loc,
        user_ip: "1.1.1.1", // dummy fallback; server can replace later
        user_agent: navigator.userAgent,
      };

      const query = new URLSearchParams(PARAMS).toString();

      const headers = new Headers();
      headers.set("Authorization", `Basic ${btoa(`${API_KEY}:`)}`);
      headers.set("Content-Type", "application/json");
      headers.set("Referer", "https://www.guidancegoose.com/jobs");

      const response = await fetch(
        `https://${API_HOSTNAME}${API_SEARCH_PATH}?${query}`,
        { method: "GET", headers }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Job Board</h1>

      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-4 mb-8 justify-center"
      >
        <input
          type="text"
          placeholder="Job title, keywords or company"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border rounded-md px-4 py-2 w-full md:w-1/2"
        />
        <input
          type="text"
          placeholder="City or state"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-md px-4 py-2 w-full md:w-1/4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center">Loading jobs...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid gap-4">
        {jobs.slice(0, 10).map((job, i) => (
          <a
            key={i}
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border rounded-lg p-4 hover:shadow-md bg-white transition"
          >
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-700">{job.company}</p>
            <p className="text-sm text-gray-500">{job.locations}</p>
            {job.salary && (
              <p className="text-sm text-green-600 font-medium">{job.salary}</p>
            )}
          </a>
        ))}
      </div>

      {!loading && jobs.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-6">No jobs found.</p>
      )}
    </div>
  );
}
