import { ChevronDown } from "lucide-react";
import type { Faq } from "@tve/content";
import { JsonLd } from "./JsonLd";

/** Accessible FAQ accordion (native <details>) plus FAQPage structured data. */
export function FaqList({
  faqs,
  title,
  headingId = "faqs",
  jsonLd = true,
}: {
  faqs: Faq[];
  title: string;
  headingId?: string;
  jsonLd?: boolean;
}) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface">
        {faqs.map((f, i) => (
          <details key={i} className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown
                className="size-5 shrink-0 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="px-4 pb-4 text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
      {jsonLd && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}
    </section>
  );
}
