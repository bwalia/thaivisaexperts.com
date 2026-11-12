import { LOCALES } from "@tve/content";
import { isRtl } from "@tve/content/locales";
import { LOCALE_NAMES } from "@/lib/site";

const TEXT = {
  en: ["Page not found", "Go to the home page"],
  fr: ["Page introuvable", "Aller à l'accueil"],
  nl: ["Pagina niet gevonden", "Naar de homepage"],
  th: ["ไม่พบหน้านี้", "ไปที่หน้าแรก"],
  es: ["Página no encontrada", "Ir a la página de inicio"],
  de: ["Seite nicht gefunden", "Zur Startseite"],
  pt: ["Página não encontrada", "Ir para a página inicial"],
  ru: ["Страница не найдена", "На главную"],
  zh: ["找不到该页面", "返回首页"],
  ja: ["ページが見つかりません", "トップページへ"],
  ko: ["페이지를 찾을 수 없습니다", "홈으로 가기"],
  hi: ["पेज नहीं मिला", "होम पेज पर जाएँ"],
  pa: ["ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ", "ਮੁੱਖ ਪੰਨੇ 'ਤੇ ਜਾਓ"],
  ar: ["الصفحة غير موجودة", "الانتقال إلى الصفحة الرئيسية"],
  ms: ["Halaman tidak ditemui", "Pergi ke laman utama"],
  vi: ["Không tìm thấy trang", "Về trang chủ"],
} as const;

// Global 404 (404.html in the static export). Offers every language.
export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", lineHeight: 1.7 }}>
        <h1>Page not found</h1>
        <ul>
          {LOCALES.map((l) => (
            <li key={l} lang={l} dir={isRtl(l) ? "rtl" : undefined}>
              {TEXT[l][0]}: <a href={`/${l}/`}>{TEXT[l][1]}</a> ({LOCALE_NAMES[l]})
            </li>
          ))}
        </ul>
      </body>
    </html>
  );
}
