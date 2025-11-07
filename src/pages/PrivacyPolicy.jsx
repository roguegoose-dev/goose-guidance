// src/pages/PrivacyPolicy.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-1 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

          <section className="space-y-6 text-gray-800 leading-relaxed">
            <p>
              Guidance Goose respects your privacy. This summary explains, in plain language,
              what we collect, how we use it, and the choices you have. It’s meant to be
              easy to read and is not a substitute for legal advice.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-2">What we collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Content you provide</span> (e.g., messages,
                  prompts, files or images you upload for analysis/OCR).
                </li>
                <li>
                  <span className="font-medium">Basic usage data</span> (e.g., pages visited,
                  buttons clicked, approximate timestamps) to help improve the app.
                </li>
                <li>
                  <span className="font-medium">Technical data</span> (e.g., browser type,
                  device info, IP-derived region) used for security and performance.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">How we use information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To respond to your requests and power chat features.</li>
                <li>To improve reliability, safety, and user experience.</li>
                <li>To comply with legal obligations and protect against abuse.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">AI processing</h2>
              <p>
                We use third-party AI services (for example, OpenAI for text/voice and an OCR
                service for image text extraction) to generate responses and audio. Your prompts
                and uploaded content may be sent to these providers for processing. Their terms
                and privacy practices apply in addition to ours. Do not submit sensitive personal
                information you’re not comfortable sharing with these services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Cookies & analytics</h2>
              <p>
                We may use cookies or similar technologies to keep you signed in, remember
                preferences, and understand aggregate usage. You can usually control cookies
                in your browser settings; some features may not work without them.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Advertising (AdSense)</h2>
              <p>
                If we enable ads (e.g., Google AdSense), ad partners may use cookies or
                similar tech to show relevant ads and measure performance. When live,
                this section will link to the partner’s disclosures and controls.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Data sharing</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <span className="font-medium">Service providers:</span> We share
                  only what’s needed to operate functions like AI processing, hosting, and analytics.
                </li>
                <li>
                  <span className="font-medium">Legal/safety:</span> We may disclose information
                  if required by law or to protect users, our services, or the public.
                </li>
                <li>
                  <span className="font-medium">No selling of personal data:</span> We do not sell
                  your personal information.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Retention</h2>
              <p>
                We keep information only as long as needed for the purposes above, and then
                delete or de-identify it unless a longer period is required by law or for
                legitimate business needs (e.g., security, fraud prevention).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Your choices</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Limit what you share. Avoid sensitive personal details.</li>
                <li>Control cookies via your browser settings.</li>
                <li>
                  Contact us to request access, correction, or deletion where applicable.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Children</h2>
              <p>
                This app is not intended for children under 13, and we do not knowingly collect
                data from them.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Security</h2>
              <p>
                We use reasonable safeguards to protect information. No system is 100% secure,
                so please use the service responsibly.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Changes to this policy</h2>
              <p>
                We may update this policy as our services evolve. We’ll adjust the “Last updated”
                date and, when appropriate, provide additional notice.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p>
                Questions or requests? Email us at{" "}
                <a href="mailto:contact@guidancegoose.com" className="text-blue-700 underline">
                  contact@guidancegoose.com
                </a>.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
