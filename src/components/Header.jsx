import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const isActive = (p) =>
    pathname === p ? "underline underline-offset-4 font-semibold" : "";

  return (
    <header className="w-full bg-blue-700 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        {/* Logo / Home Link */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-blue-100 transition"
          aria-label="Guidance Goose Home"
        >
          🪶 Guidance Goose
        </Link>

        {/* Navigation */}
        <nav className="space-x-6 text-sm">
          <Link to="/" className={`hover:underline ${isActive("/")}`}>
            Home
          </Link>

          <Link to="/about" className={`hover:underline ${isActive("/about")}`}>
            About
          </Link>

          <Link
            to="/whitepages"
            className={`hover:underline ${isActive("/whitepages")}`}
          >
            White Pages
          </Link>

          <Link to="/jobs" className={`hover:underline ${isActive("/jobs")}`}>
            Jobs
          </Link>

          {/* Blog on WordPress (staging URL for now) */}
          <a
            href="https://guidancegoose.wpcomstaging.com/"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blog
          </a>
        </nav>
      </div>
    </header>
  );
}
