import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import About from "./pages/About.jsx";
import WhitePages from "./pages/WhitePages.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Terms from "./pages/Terms.jsx";
import MoreGeese from "./pages/MoreGeese.jsx";
import ResumeGoose from "./pages/ResumeGoose.jsx";
import ScholarGoose from "./pages/ScholarGoose.jsx";
import WellnessGoose from "./pages/WellnessGoose.jsx";
import Blog from "./pages/Blog.jsx";
import Post from "./pages/Post.jsx";
import SignIn from "./pages/SignIn.jsx";
import Ping from "./pages/Ping.jsx";

// ✅ Add this import
import JobBoard from "./pages/JobBoard.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<App />} />

        {/* Specialty */}
        <Route path="/more-geese" element={<MoreGeese />} />
        <Route path="/resume-goose" element={<ResumeGoose />} />
        <Route path="/scholar-goose" element={<ScholarGoose />} />
        <Route path="/wellness-goose" element={<WellnessGoose />} />

        {/* Blog */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Post />} />

        {/* 💼 Job Board */}
        <Route path="/jobs" element={<JobBoard />} />

        {/* Utilities */}
        <Route path="/ping" element={<Ping />} />

        {/* Info */}
        <Route path="/about" element={<About />} />
        <Route path="/white-pages" element={<WhitePages />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Catch-all */}
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
);
