"use client";

import { useState } from "react";
import { Link2, MessageCircle, Share2, Check } from "lucide-react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = () => window.location.href;
  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url());
    }
  };

  const btn =
    "inline-flex items-center gap-2 rounded-full border border-regal-navy/15 bg-white px-4 py-2 text-sm font-medium text-regal-navy transition hover:-translate-y-0.5 hover:border-regal-gold hover:bg-regal-gold hover:shadow-md";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-regal-earth">Share:</span>
      <button
        type="button"
        className={btn}
        onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`)}
      >
        <MessageCircle size={16} /> WhatsApp
      </button>
      <button
        type="button"
        className={btn}
        onClick={() =>
          open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`)
        }
      >
        <Share2 size={16} /> Facebook
      </button>
      <button type="button" className={btn} onClick={copy}>
        {copied ? <Check size={16} /> : <Link2 size={16} />} {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}