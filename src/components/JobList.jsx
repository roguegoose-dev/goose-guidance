import { useEffect, useState } from "react";
import { fetchJobs } from "../api/adzuna";

export default function JobList({ query }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchJobs("us", query)
      .then((data) => setJobs(data.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="p-4 border rounded-lg shadow-sm hover:bg-gray-50">
          <a
            href={job.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-700 hover:underline"
          >
            {job.title}
          </a>
          <p className="text-gray-700">{job.company.display_name}</p>
          <p className="text-sm text-gray-600">
            {job.location.display_name} — ${job.salary_min ?? "?"}+
          </p>
        </div>
      ))}
    </div>
  );
}
