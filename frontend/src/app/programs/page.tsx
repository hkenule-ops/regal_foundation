import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Utensils,
  GraduationCap,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
  Heart,
  Pill,
  Eye,
  Baby,
  Shirt,
  BookOpen,
  HandHeart,
  Truck,
  Camera,
  Users,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import FoundationImage from "@/components/FoundationImage";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Free rural medical outreach, community feeding and nutrition, child education support and maternal wellness, delivered together in Nigerian villages.",
};

/* Put your photos in /public/images/ using these names (or change the paths). */
const IMG = {
  hero: "/images/programs-hero.jpg",
  cta: "/images/programs-cta.jpg",
};

const programs = [
  {
    id: "healthcare",
    icon: Stethoscope,
    title: "Rural Medical Outreach",
    img: "/images/program-healthcare.jpg",
    intro:
      "A full clinic, brought to the village. Our medical teams set up where people live, so a mother does not have to choose between a day's work and a doctor's visit.",
    items: [
      "General consultations",
      "Eye checks & basic vision support",
      "Dental care",
      "Maternal wellness",
      "Free pharmacy / essential medications",
      "Surgical referrals where needed",
    ],
    fund: "Fund medical supplies",
  },
  {
    id: "feeding",
    icon: Utensils,
    title: "Community Feeding & Nutrition",
    img: "/images/program-feeding.jpg",
    intro:
      "Good health starts with a full plate. Alongside every clinic we serve hot meals and provide food relief to families who are struggling to eat.",
    items: [
      "Hot meal drives during outreach",
      "Family food relief packages",
      "Support for households facing acute food insecurity",
    ],
    fund: "Fund a feeding drive",
  },
  {
    id: "education",
    icon: GraduationCap,
    title: "Child Education Support",
    img: "/images/program-education.jpg",
    intro:
      "A child who is healthy and fed still needs to be in class. We remove the costs that keep children at home so that learning continues.",
    items: [
      "Scholarships & school fee support",
      "Books, bags & uniforms",
      "Learning materials",
      "Keeping children in school",
    ],
    fund: "Fund a child's education",
  },
  {
    id: "maternal",
    icon: HeartPulse,
    title: "Maternal Wellness",
    img: "/images/program-maternal.jpg",
    intro:
      "Safer pregnancies and healthier starts for babies. We give expectant mothers awareness, basic checks and a clear path to higher-level care when they need it.",
    items: [
      "Antenatal awareness",
      "Basic maternal health checks",
      "Referrals to higher-level care",
      "Integration with community healthcare",
    ],
    fund: "Support maternal care",
  },
];

const oneOutreach = [
  { icon: Stethoscope, label: "Consultations" },
  { icon: Eye, label: "Eye checks" },
  { icon: Pill, label: "Free pharmacy" },
  { icon: Baby, label: "Maternal checks" },
  { icon: Utensils, label: "Hot meals" },
  { icon: HandHeart, label: "Food packages" },
  { icon: BookOpen, label: "Books & bags" },
  { icon: Shirt, label: "Uniforms" },
];

const tiers = [
  { amount: "₦10,000", impact: "feeds 10 children", icon: Utensils },
  { amount: "₦25,000", impact: "equips a child for school", icon: GraduationCap },
  { amount: "₦50,000", impact: "stocks rural outreach medications", icon: Pill },
];

const roles = [
  { icon: Stethoscope, title: "Medical Personnel", desc: "Doctors, nurses, pharmacists and lab technicians." },
  { icon: GraduationCap, title: "Education & Youth Mentors", desc: "Teachers and mentors for children in the field." },
  { icon: Truck, title: "Food & Welfare Logistics", desc: "Planning, transport and distribution on outreach day." },
  { icon: Camera, title: "Media & Documentation", desc: "Respectful photo and story capture for mission reports." },
];

const floatStyle = (rotate: string, delay?: string): CSSProperties =>
  ({ "--r": rotate, animationDelay: delay } as CSSProperties);

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-regal-navy text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage
            src={IMG.hero}
            alt="Medical outreach, feeding and school support in a village"
            priority
            sizes="100vw"
            className="animate-kenburns opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-regal-navy via-regal-navy/85 to-regal-navy/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-regal-gold/30 via-transparent to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <p className="animate-fade-up mb-3 text-sm font-semibold uppercase tracking-widest text-regal-gold-light">
            Programs
          </p>
          <h1
            className="animate-fade-up max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            style={{ animationDelay: "150ms" }}
          >
            What we deliver <span className="text-shimmer">in the field</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg text-white/80"
            style={{ animationDelay: "300ms" }}
          >
            Every outreach is designed as a holistic intervention: healthcare, nutrition and
            education support working together in the same village, on the same day.
          </p>

          <div
            className="animate-fade-up mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
            style={{ animationDelay: "450ms" }}
          >
            {programs.map((p, i) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                className="animate-float group flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 text-center backdrop-blur transition hover:bg-regal-gold hover:text-regal-navy"
                style={floatStyle("0deg", `${i * 0.6}s`)}
              >
                <p.icon size={28} className="transition group-hover:scale-110" />
                <span className="text-xs font-semibold leading-tight">{p.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky section nav */}
      <nav
        aria-label="Program sections"
        className="sticky top-16 z-40 border-b border-regal-navy/10 bg-white/90 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
          {programs.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-regal-navy/15 px-4 py-1.5 text-sm font-medium text-regal-navy transition hover:border-regal-gold hover:bg-regal-gold hover:text-regal-navy"
            >
              <p.icon size={16} /> {p.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Program sections */}
      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 md:space-y-28 md:px-6 md:py-24">
        {programs.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <section key={p.id} id={p.id} className="scroll-mt-40">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <Reveal
                  direction={flip ? "left" : "right"}
                  className={`relative ${flip ? "lg:order-2" : ""}`}
                >
                  <div className="group relative h-[340px] overflow-hidden rounded-3xl shadow-xl md:h-[460px]">
                    <FoundationImage
                      src={p.img}
                      alt={p.title}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-regal-navy/60 via-transparent to-transparent" />
                  </div>
                  <div
                    className={`animate-float absolute -bottom-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-regal-gold text-regal-navy shadow-2xl ${
                      flip ? "-left-3 md:-left-6" : "-right-3 md:-right-6"
                    }`}
                    style={floatStyle(flip ? "4deg" : "-4deg")}
                  >
                    <p.icon size={36} />
                  </div>
                  <span
                    className={`absolute -top-6 select-none font-display text-7xl font-bold text-regal-navy/10 md:text-8xl ${
                      flip ? "right-2" : "left-2"
                    }`}
                  >
                    0{i + 1}
                  </span>
                </Reveal>

                <Reveal direction={flip ? "right" : "left"} delay={150} className={flip ? "lg:order-1" : ""}>
                  <h2 className="font-display text-3xl font-bold text-regal-navy md:text-4xl">
                    {p.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-regal-charcoal">{p.intro}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {p.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 rounded-xl bg-white p-3 text-sm text-regal-charcoal shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-regal-forest" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/get-involved/donate"
                    className="group mt-7 inline-flex items-center gap-2 font-semibold text-regal-forest"
                  >
                    {p.fund}
                    <ArrowRight size={16} className="transition group-hover:translate-x-2" />
                  </Link>
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>

      {/* One outreach, many services */}
      <section className="bg-regal-navy py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-gold-light">
              Holistic by design
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              One village, one day, every kind of help
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/75">
              Care, food and school support arrive together, so families do not have to choose which
              need to meet first.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {oneOutreach.map((s, i) => (
              <Reveal key={s.label} delay={(i % 4) * 100} direction="zoom">
                <div className="group flex h-full flex-col items-center gap-3 rounded-2xl bg-white/10 p-6 text-center backdrop-blur transition duration-300 hover:-translate-y-2 hover:bg-white/20">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-regal-gold text-regal-navy transition duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <s.icon size={26} />
                  </div>
                  <span className="font-semibold">{s.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Giving tiers */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-forest">
            What your gift does
          </p>
          <h2 className="section-heading">Turn giving into real, tangible help</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.amount} delay={i * 150}>
              <Link
                href="/get-involved/donate"
                className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-regal-navy to-regal-sky p-8 text-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <t.icon
                  size={110}
                  className="absolute -bottom-4 -right-4 text-white/10 transition duration-500 group-hover:rotate-12 group-hover:scale-110"
                />
                <p className="font-display text-4xl font-bold text-regal-gold-light md:text-5xl">
                  {t.amount}
                </p>
                <p className="mt-2 text-lg font-semibold">{t.impact}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">
                  Give this amount{" "}
                  <ArrowRight size={14} className="transition group-hover:translate-x-2" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <p className="text-sm text-regal-earth">
            Pharmaceutical companies, food brands, schools and corporate teams can also give goods,
            vehicles or bulk sponsorship.{" "}
            <Link href="/get-involved/partner" className="font-semibold text-regal-forest underline">
              Partner with us
            </Link>
          </p>
        </Reveal>
      </section>

      {/* Volunteer roles */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-forest">
              Who makes it happen
            </p>
            <h2 className="section-heading">Our programs run on volunteers</h2>
            <p className="mx-auto mt-3 max-w-2xl text-regal-earth">
              Bring your skills to the field. Choose the role that fits you and tell us where you are
              based.
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((r, i) => (
              <Reveal key={r.title} delay={i * 120} direction="zoom">
                <div className="group h-full rounded-2xl bg-regal-cream p-6 ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-regal-navy text-regal-gold-light transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <r.icon size={26} />
                  </div>
                  <h3 className="mb-1 font-bold text-regal-navy">{r.title}</h3>
                  <p className="text-sm text-regal-earth">{r.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link href="/get-involved/volunteer" className="btn-secondary">
              <Users size={18} /> Join as a Volunteer
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden py-24 text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage
            src={IMG.cta}
            alt="Children and volunteers together"
            sizes="100vw"
            className="animate-kenburns"
          />
          <div className="absolute inset-0 bg-regal-navy/80" />
        </div>
        <Reveal className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-5xl">Fund a program area</h2>
          <p className="mt-3 text-white/85">
            Choose where your gift goes: medical supplies, a feeding drive, a child&apos;s education,
            or wherever it is needed most.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved/donate" className="btn-primary animate-pulse-ring">
              <Heart size={18} /> Fund a Program Area
            </Link>
            <Link href="/missions" className="btn-outline-light">
              See Our Missions
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}