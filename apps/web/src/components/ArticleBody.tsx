import type { ArticleSection } from "@tve/content";

export function sectionId(i: number) {
  return `section-${i + 1}`;
}

/** Renders structured article sections (guides and static pages). */
export function ArticleBody({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="prose-tve max-w-3xl">
      {sections.map((s, i) => {
        const List = s.ordered ? "ol" : "ul";
        return (
          <section key={i} aria-labelledby={sectionId(i)}>
            <h2 id={sectionId(i)}>{s.heading}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {s.list.length > 0 && (
              <List>
                {s.list.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </List>
            )}
          </section>
        );
      })}
    </div>
  );
}
