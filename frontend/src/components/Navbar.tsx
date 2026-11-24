"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/missions", label: "Missions" },
  { href: "/stories", label: "Stories" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-regal-navy/10 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-regal-cream">
            <Image
              src="/images/logo.png"
              alt="Regal Health and Humanity Foundation logo"
              fill
              sizes="64px"
              className="origin-[50%_11%] scale-[1.3] object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <span className="block text-sm font-bold leading-tight text-regal-navy">
              Regal Foundation
            </span>
            <span className="block text-xs text-regal-earth">Community Outreach</span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-regal-charcoal transition hover:text-regal-gold"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/get-involved/donate" className="btn-primary !py-2 !px-4 text-sm">
            Donate
          </Link>
        </div>

        <button
          className="lg:hidden rounded-lg p-2 text-regal-navy"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-regal-cream"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/get-involved/donate"
              className="btn-primary mt-2 text-center"
              onClick={() => setOpen(false)}
            >
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
