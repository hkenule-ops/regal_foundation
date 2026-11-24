"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Fills its (relatively positioned) parent. If the file is missing or the
 * src is empty, shows a branded gradient instead of a broken image.
 */
export default function FoundationImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`absolute inset-0 bg-gradient-to-br from-regal-navy via-regal-navy/80 to-regal-gold/60 ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}