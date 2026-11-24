import type { ReactNode } from "react";
import FoundationImage from "@/components/FoundationImage";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  image?: string | null;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-regal-navy text-white">
      <div className="absolute inset-0 -z-10">
        <FoundationImage
          src={image}
          alt=""
          priority
          sizes="100vw"
          className="animate-kenburns opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-regal-navy via-regal-navy/85 to-regal-navy/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-regal-gold/30 via-transparent to-transparent" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <p className="animate-fade-up mb-3 text-sm font-semibold uppercase tracking-widest text-regal-gold-light">
          {eyebrow}
        </p>
        <h1
          className="animate-fade-up max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
          style={{ animationDelay: "150ms" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg text-white/80"
            style={{ animationDelay: "300ms" }}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div
            className="animate-fade-up mt-8 flex flex-wrap gap-4"
            style={{ animationDelay: "450ms" }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
