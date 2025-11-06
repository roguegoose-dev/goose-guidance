export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-300 py-6 mt-10">
      <div className="max-w-6xl mx-auto text-center text-sm text-gray-600 space-x-4">
        <a href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </a>
        <a href="/terms" className="hover:underline">
          Terms of Service
        </a>
        <a href="/white-pages" className="hover:underline">
          White Pages
        </a>
        <p className="mt-3 text-xs text-gray-400">
          © {new Date().getFullYear()} Guidance Goose — All rights reserved.
        </p>
      </div>
    </footer>
  );
}


