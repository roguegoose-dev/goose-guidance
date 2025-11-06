export default function Header() {
  return (
    <header className="w-full bg-blue-700 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold tracking-wide">
          🪶 Guidance Goose
        </h1>
        <nav className="space-x-6 text-sm">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/about" className="hover:underline">
            About
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

