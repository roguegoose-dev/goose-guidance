import { useEffect } from "react";

export default function AdUnit({
  slot = "1234567890",                 // replace with your real slot ID
  style = { display: "block", margin: "24px 0" },
  format = "auto",
  responsive = "true",
  test = false,                        // set true to force test ads
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client="ca-pub-YOURID"   // <-- replace with your real ca-pub
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      {...(test ? { "data-adtest": "on" } : {})}
    />
  );
}
