/** Simple wordmark + abstract sun/wave mark. Deliberately nothing resembling official seals. */
export function Logo({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-bold text-foreground">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="13" r="7" fill="var(--tve-accent)" />
        <path d="M3 22c4-3 8-3 13 0s9 3 13 0v5H3z" fill="var(--tve-primary)" />
      </svg>
      <span className="text-base leading-none sm:text-lg">{name}</span>
    </span>
  );
}
