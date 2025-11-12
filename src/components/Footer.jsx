export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top: nav + contact */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-700">
            <a href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
            <a href="/white-pages" className="hover:underline">
              White Pages
            </a>
            <a href="/blog" className="hover:underline">
              Blog
            </a>
            <a href="/about" className="hover:underline">
              About
            </a>
          </nav>

          <div className="text-center text-sm text-gray-600">
            <a
              href="mailto:marvin@guidancegoose.com"
              className="hover:underline"
            >
              contact@guidancegoose.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-gray-200" />

        {/* Bottom: branding / tagline */}
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs text-gray-500">
            Guidance Goose — Built by Goose Solutions
          </p>

          {/* Optional small print or version tag */}
          <p className="text-xs text-gray-400">
            Updated {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long" })}
          </p>
        </div>
      </div>
    </footer>
  );
}
