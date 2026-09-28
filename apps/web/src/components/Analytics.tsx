import Script from "next/script";

/**
 * Privacy-friendly analytics, off by default. Enable with env vars at build time:
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN=thaivisaexperts.com  or
 * NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id> (+ optional NEXT_PUBLIC_UMAMI_SRC).
 * Both are cookieless, so no cookie banner is needed.
 */
export function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umami = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (plausible)
    return (
      <Script
        defer
        data-domain={plausible}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  if (umami)
    return (
      <Script
        defer
        data-website-id={umami}
        src={process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js"}
        strategy="afterInteractive"
      />
    );
  return null;
}
