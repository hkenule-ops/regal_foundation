"use client";

import { useEffect, useState } from "react";

/** Thin gold bar at the very top that fills as the reader scrolls the article. */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[60] h-1 w-full bg-transparent" aria-hidden>
      <div
        className="h-full bg-gradient-to-r from-regal-gold to-regal-sky transition-[width] duration-100"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}