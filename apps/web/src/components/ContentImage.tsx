import Image from "next/image";
import { getImage, type Locale } from "@tve/content";

interface Props {
  id: string | null | undefined;
  locale: Locale;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Fill the parent box (parent must be positioned and sized). */
  fill?: boolean;
}

/** Renders an image from the registry by id, with localised alt text. Space is reserved to avoid CLS. */
export function ContentImage({ id, locale, sizes, priority, className, fill }: Props) {
  const img = getImage(id);
  if (!img) return null;
  const alt = img.alt[locale];
  return fill ? (
    <Image
      src={img.src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      fill
      style={{ objectFit: "cover" }}
    />
  ) : (
    <Image
      src={img.src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      width={img.width}
      height={img.height}
    />
  );
}
