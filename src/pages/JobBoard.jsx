// src/pages/JobBoard.jsx
import { useState } from "react";
import Header from "../components/Header";

export default function JobBoard() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Oklahoma");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Category and Subcategory state
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const categories = {
    Technology: [
      { label: "All Technology", value: "it-jobs" },
      { label: "Engineering", value: "engineering-jobs" },
      { label: "Helpdesk & Support", value: "customer-services-jobs" },
      { label: "Cybersecurity", value: "it-jobs" },
      { label: "Data & Analytics", value: "it-jobs" },
    ],
    PublicService: [
      { label: "All Public Service", value: "public-sector-jobs" },
      { label: "Firefighter", value: "security-jobs" },
      { label: "Police / Law Enforcement", value: "security-jobs" },
      { label: "Military / Defense", value: "security-jobs" },
      { label: "Emergency Medical", value: "healthcare-nursing-jobs" },
    ],
    Healthcare: [
      { label: "All Healthcare", value: "healthcare-nursing-jobs" },
      { label: "Nursing", value: "healthcare-nursing-jobs" },
      { label: "Allied Health", value: "healthcare-nursing-jobs" },
      { label: "Mental Health", value: "healthcare-nursing-jobs" },
    ],
    Business: [
      { label: "All Business", value: "accounting-finance-jobs" },
      { label: "Finance & Accounting", value: "accounting-finance-jobs" },
      { label: "Project Management", value: "consultancy-jobs" },
      { label: "Human Resources", value: "hr-jobs" },
      { label: "Administrative", value: "admin-jobs" },
    ],
    SkilledTrades: [
      { label: "All Trades", value: "construction-trades-jobs" },
      { label: "Construction", value: "construction-trades-jobs" },
      { label: "Mechanic / Technician", value: "engineering-jobs" },
      { label: "Electrical / HVAC / Plumbing", value: "engineering-jobs" },
    ],
    Creative: [
      { label: "All Creative", value: "creative-design-jobs" },
      { label: "Design / Graphics", value: "creative-design-jobs" },
      { label: "Writing / Media", value: "arts-jobs" },
      { label: "Marketing / Content", value: "advertising-pr-jobs" },
    ],
    Logistics: [
      { label: "All Logistics", value: "logistics-warehouse-jobs" },
      { label: "Driver / CDL", value: "logistics-warehouse-jobs" },
      { label: "Warehouse / Operations", value: "logistics-warehouse-jobs" },
    ],
    Education: [
      { label: "All Education", value: "teaching-jobs" },
      { label: "Teacher / Instructor", value: "teaching-jobs" },
      { label: "Trainer / Corporate Learning", value: "teaching-jobs" },
    ],
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const categoryValue =
        subCategory || (mainCategory ? categories[mainCategory][0].value : "");

      const params = new URLSearchParams({
        keywords: keyword,
        location,
        category: categoryValue,
      });

      const response = await fetch(`/api/jobs?${params}`);
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
      <div className="max-w-6xl mx-auto py-10 px-4 text-black overflow-visible">
        <h1 className="text-3xl font-bold mb-6 text-center">Job Board</h1>

        {/* 🔍 Search Bar and Filters */}
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 relative overflow-visible"
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

          <div className="relative overflow-visible">
            <select
              value={mainCategory}
              onChange={(e) => {
                setMainCategory(e.target.value);
                setSubCategory("");
              }}
              className="border rounded-md px-3 py-2 text-sm text-gray-700 relative z-10 w-full focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All Categories</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/([A-Z])/g, " $1").trim()}
                </option>
              ))}
            </select>
          </div>

          <div className="relative overflow-visible">
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={!mainCategory}
              className="border rounded-md px-3 py-2 text-sm text-gray-700 relative z-10 w-full focus:ring-2 focus:ring-blue-600"
            >
              <option value="">
                {mainCategory
                  ? "Select Subcategory"
                  : "Choose a main category first"}
              </option>
              {mainCategory &&
                categories[mainCategory].map((sub) => (
                  <option key={sub.value} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* 🌀 Loading & Error */}
        {loading && (
          <p className="text-center text-gray-600">Loading jobs...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* 🧾 Results */}
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
            No jobs found. Try adjusting your search.
          </p>
        )}
      </div>
    </>
  );
}
