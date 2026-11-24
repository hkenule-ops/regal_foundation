import type { Metadata } from "next";
import Link from "next/link";
import {
  HeartHandshake,
  Stethoscope,
  Building2,
  MapPin,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Donate, volunteer, partner with us or nominate a community for the next Regal Foundation outreach.",
};

type Way = {
  href: string;
  title: string;
  blurb: string;
  cta: string;
  icon: LucideIcon;
  featured?: boolean;
};

const ways: Way[] = [
  {
    href: "/get-involved/donate",
    title: "Donate",
    blurb:
      "Fund medications, meals and school support for the communities we visit. Every donation is receipted and goes straight to outreach.",
    cta: "Give now",
    icon: HeartHandshake,
    featured: true,
  },
  {
    href: "/get-involved/volunteer",
    title: "Volunteer",
    blurb:
      "Doctors, nurses, pharmacists, lab techs, mentors and logistics helpers: give a day of your skills on an outreach.",
    cta: "Join the team",
    icon: Stethoscope,
  },
  {
    href: "/get-involved/partner",
    title: "Partner with us",
    blurb:
      "Companies and organisations can pledge medicines, food, school supplies or logistics support.",
    cta: "Make a pledge",
    icon: Building2,
  },
  {
    href: "/get-involved/nominate",
    title: "Nominate a community",
    blurb:
      "Know a community that needs care? Tell us about it and we will consider it for an upcoming mission.",
    cta: "Nominate",
    icon: MapPin,
  },
];

const steps = [
  { n: "1", title: "Choose how to help", text: "Pick the option that fits your time, skills or resources." },
  { n: "2", title: "Tell us a little", text: "Fill a short form. It takes about two minutes." },
  { n: "3", title: "We follow up", text: "Our team reaches out and shows you where your help goes." },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title={<>Be part of the <span className="text-regal-gold-light">care</span></>}
        subtitle="There is a place for everyone in our outreach: giving, serving, partnering or pointing us to a community that needs help."
      >
        <Link href="/get-involved/donate" className="btn-primary">
          Donate now <ArrowRight size={18} />
        </Link>
        <Link href="/get-involved/volunteer" className="btn-outline-light">
          Volunteer
        </Link>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-heading">Four ways to help</h2>
            <p className="mt-3 text-regal-earth">
              Choose what works for you. Each one directly supports healthcare,
              feeding and education in the communities we serve.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ways.map((w, i) => (
            <Reveal key={w.href} delay={i * 100}>
              <Link
                href={w.href}
                className={`group flex h-full flex-col rounded-2xl p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  w.featured
                    ? "bg-regal-navy text-white shadow-lg"
                    : "bg-white shadow-sm ring-1 ring-black/5"
                }`}
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                    w.featured ? "bg-regal-gold text-regal-navy" : "bg-regal-cream text-regal-forest"
                  }`}
                >
                  <w.icon size={28} />
                </span>
                <h3
                  className={`mt-5 font-display text-2xl font-bold ${
                    w.featured ? "text-white" : "text-regal-navy"
                  }`}
                >
                  {w.title}
                </h3>
                <p className={`mt-2 flex-1 ${w.featured ? "text-white/80" : "text-regal-earth"}`}>
                  {w.blurb}
                </p>
                <span
                  className={`mt-6 inline-flex items-center gap-2 font-semibold ${
                    w.featured ? "text-regal-gold-light" : "text-regal-forest"
                  }`}
                >
                  {w.cta}
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <Reveal>
            <h2 className="section-heading text-center">How it works</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-regal-gold font-bold text-regal-navy">
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-semibold text-regal-navy">{s.title}</h3>
                  <p className="mt-1 text-sm text-regal-earth">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-regal-navy py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Not sure where to start?</h2>
          <p className="mt-3 text-white/80">
            Talk to us. We will help you find the best way to get involved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">Contact us</Link>
            <Link href="/missions" className="btn-outline-light">See our missions</Link>
          </div>
        </div>
      </section>
    </>
  );
}