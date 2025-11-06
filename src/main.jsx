import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import About from "./pages/About.jsx";
import WhitePages from "./pages/WhitePages.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Terms from "./pages/Terms.jsx"; // optional, but good to include

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Main Goose Chat */}
        <Route path="/" element={<App />} />

        {/* Informational Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/white-pages" element={<WhitePages />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Catch-all route (redirects to home/chat) */}
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
);
