// src/pages/JobBoard.jsx
import { useEffect } from "react";

export default function JobBoard() {
  useEffect(() => {
    // Inject Search Box script if not already present
    if (!document.getElementById("cj-search-box")) {
      const s1 = document.createElement("script");
      s1.id = "cj-search-box";
      s1.async = true;
      s1.src =
        "https://static.careerjet.org/js/all_widget_search_box_3rd_party.min.js?t=" +
        Date.now();
      document.body.appendChild(s1);
    }

    // Inject Job Box script if not already present
    if (!document.getElementById("cj-job-box")) {
      const s2 = document.createElement("script");
      s2.id = "cj-job-box";
      s2.async = true;
      s2.src =
        "https://static.careerjet.org/js/all_widget_job_box_3rd_party.min.js?t=" +
        Date.now();
      document.body.appendChild(s2);
    }

    // Optional: cleanup on unmount (remove scripts)
    return () => {
      // If you prefer to keep scripts cached across navigations, comment these out.
      document.getElementById("cj-search-box")?.remove();
      document.getElementById("cj-job-box")?.remove();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Job Board</h1>

      {/* Search Box */}
      <div className="mb-8">
        <div
          className="cj-search-box"
          data-url="https://widget.careerjet.net/search-box/e96a998013e5af3983918f18e7f2ff7c"
        />
      </div>

      {/* Job Results */}
      <div>
        <div
          className="cj-job-box"
          data-url="https://widget.careerjet.net/job-box/ae9c46b402222f927edd13bd4af902b8"
          data-search=""         // optional: preset query, e.g., "Data Analyst"
          data-location="Oklahoma" // optional: preset location
        />
      </div>
    </div>
  );
}
