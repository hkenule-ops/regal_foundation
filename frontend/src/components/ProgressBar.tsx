"use client";

import { useEffect, useRef, useState } from "react";

/** Fills from 0 to `percent` when scrolled into view. */
export default function ProgressBar({
  percent,
  trackClassName = "bg-white/20",
}: {
  percent: number;
  trackClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setGo(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGo(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pct = Math.max(0, Math.min(100, percent));

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-3 overflow-hidden rounded-full ${trackClassName}`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-regal-gold to-regal-gold-light transition-[width] duration-[1500ms] ease-out"
        style={{ width: go ? `${pct}%` : "0%" }}
      />
    </div>
  );
}