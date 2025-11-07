// src/main.jsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";

// Core Pages
import App from "./App.jsx";
import About from "./pages/About.jsx";
import WhitePages from "./pages/WhitePages.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Terms from "./pages/Terms.jsx";

// Specialty Pages
import MoreGeese from "./pages/MoreGeese.jsx";
import ResumeGoose from "./pages/ResumeGoose.jsx";
import ScholarGoose from "./pages/ScholarGoose.jsx";
import WellnessGoose from "./pages/WellnessGoose.jsx";

// Blog System
import Blog from "./pages/Blog.jsx";
import Post from "./pages/Post.jsx";

// Scroll to top on every route change
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
        {/* 🪶 Core Experience */}
        <Route path="/" element={<App />} />

        {/* 🪶 Specialty Geese */}
        <Route path="/more-geese" element={<MoreGeese />} />
        <Route path="/resume-goose" element={<ResumeGoose />} />
        <Route path="/scholar-goose" element={<ScholarGoose />} />
        <Route path="/wellness-goose" element={<WellnessGoose />} />

        {/* 📰 Blog + Articles */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Post />} />

        {/* 📘 Info Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/white-pages" element={<WhitePages />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        {/* 🚪 Fallback */}
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
);
