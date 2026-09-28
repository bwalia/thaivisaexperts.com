import type { Metadata } from "next";
import { LOCALES } from "@tve/content";
import { LOCALE_NAMES, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thai Visa Experts",
  alternates: {
    canonical: `${SITE_URL}/en/`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/`])),
      "x-default": `${SITE_URL}/en/`,
    },
  },
  robots: { index: false, follow: true },
};

// Static export has no server, so pick the language in the browser:
// saved choice → browser languages → English.
const pickLocale = `(function(){var L=${JSON.stringify(LOCALES)},c=null;
try{c=localStorage.getItem("tve-locale")}catch(e){}
if(L.indexOf(c)<0){c="en";var n=navigator.languages||[navigator.language];
for(var i=0;i<n.length;i++){var p=String(n[i]).slice(0,2).toLowerCase();if(L.indexOf(p)>=0){c=p;break}}}
location.replace("/"+c+"/"+location.search+location.hash)})();`;

export default function RootPage() {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickLocale }} />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en/" />
        </noscript>
      </head>
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <p>Thai Visa Experts</p>
        <ul>
          {LOCALES.map((l) => (
            <li key={l} lang={l}>
              <a href={`/${l}/`}>{LOCALE_NAMES[l]}</a>
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
