import type { ReactNode } from "react";
import type { Locale } from "@tve/content";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { ContentImage } from "./ContentImage";

interface Props {
  locale: Locale;
  title: string;
  intro?: string;
  crumbs: Crumb[];
  path: string;
  imageId?: string | null;
  children?: ReactNode;
}

export function PageHeader({ locale, title, intro, crumbs, path, imageId, children }: Props) {
  return (
    <div className="border-b border-border bg-surface">
      <div
        className={`container-page grid gap-6 py-8 sm:py-10 ${imageId ? "md:grid-cols-[3fr_2fr] md:items-center" : ""}`}
      >
        <div className="min-w-0">
          <Breadcrumbs locale={locale} items={crumbs} path={path} />
          <h1 className="mt-4 text-3xl text-foreground sm:text-4xl">{title}</h1>
          {intro && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
          {children}
        </div>
        {imageId && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-md">
            <ContentImage
              id={imageId}
              locale={locale}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </div>
        )}
      </div>
    </div>
  );
}
