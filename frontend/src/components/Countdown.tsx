"use client";

import { useEffect, useState } from "react";

export default function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = now === null ? 0 : Math.max(0, new Date(target).getTime() - now);
  const s = Math.floor(diff / 1000);
  const parts = [
    { label: "Days", value: Math.floor(s / 86400) },
    { label: "Hours", value: Math.floor((s % 86400) / 3600) },
    { label: "Mins", value: Math.floor((s % 3600) / 60) },
    { label: "Secs", value: s % 60 },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Time until the outreach starts">
      {parts.map((p) => (
        <div
          key={p.label}
          className="rounded-2xl bg-white/10 px-2 py-3 text-center backdrop-blur sm:px-4"
        >
          <div className="font-display text-2xl font-bold tabular-nums text-regal-gold-light sm:text-4xl">
            {now === null ? "--" : String(p.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/70 sm:text-xs">
            {p.label}
          </div>
        </div>
      ))}
    </div>
  );
}