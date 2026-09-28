import { LOCALES } from "@tve/content";
import { LOCALE_NAMES } from "@/lib/site";

const TEXT = {
  en: ["Page not found", "Go to the home page"],
  fr: ["Page introuvable", "Aller à l'accueil"],
  nl: ["Pagina niet gevonden", "Naar de homepage"],
  th: ["ไม่พบหน้านี้", "ไปที่หน้าแรก"],
} as const;

// Global 404 (404.html in the static export). Offers every language.
export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", lineHeight: 1.7 }}>
        <h1>Page not found</h1>
        <ul>
          {LOCALES.map((l) => (
            <li key={l} lang={l}>
              {TEXT[l][0]}: <a href={`/${l}/`}>{TEXT[l][1]}</a> ({LOCALE_NAMES[l]})
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
