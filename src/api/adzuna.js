const BASE_URL = "https://api.adzuna.com/v1/api/jobs";

export async function fetchJobs(country = "us", query = "data analyst", page = 1) {
  const appId = import.meta.env.VITE_ADZUNA_APP_ID;
  const apiKey = import.meta.env.VITE_ADZUNA_API_KEY;

  const url = `${BASE_URL}/${country}/search/${page}?app_id=${appId}&app_key=${apiKey}&results_per_page=20&what=${encodeURIComponent(
    query
  )}&content-type=application/json`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch jobs");
  return response.json();
}
