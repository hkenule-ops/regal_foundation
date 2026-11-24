import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Heart,
  Eye,
  ShieldCheck,
  Handshake,
  Stethoscope,
  Utensils,
  GraduationCap,
  Baby,
  Search,
  Users,
  Megaphone,
  Truck,
  BarChart3,
  Building2,
  Lock,
  Camera,
  User,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { api, type ImpactMetrics } from "@/lib/api";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import FoundationImage from "@/components/FoundationImage";
import LogoBadge from "@/components/LogoBadge";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Our story, mission and clinical backing: how the Foundation brings free healthcare, feeding drives and child education to rural Nigerian communities.",
};

/* Put your photos in /public/images/ using these names (or change the paths). */
const IMG = {
  hero: "/images/about-hero.jpg",
  story1: "/images/about-story-1.jpg",
  story2: "/images/about-story-2.jpg",
  clinic: "/images/about-clinic.jpg",
  process: "/images/about-process.jpg",
  cta: "/images/about-cta.jpg",
  healthcare: "/images/pillar-healthcare.jpg",
  feeding: "/images/pillar-feeding.jpg",
  education: "/images/pillar-education.jpg",
  maternal: "/images/pillar-maternal.jpg",
  band: [
    "/images/about-1.jpg",
    "/images/about-2.jpg",
    "/images/about-3.jpg",
    "/images/about-4.jpg",
    "/images/about-5.jpg",
    "/images/about-6.jpg",
  ],
};

/**
 * Fill this in when board profiles are ready, e.g.
 * { name: "Dr. Jane Doe", role: "Medical Director", bio: "…", img: "/images/board-jane.jpg" }
 * While it is empty, a "profiles coming soon" panel is shown instead.
 */
const board: { name: string; role: string; bio?: string; img?: string }[] = [];

const fallbackImpact: ImpactMetrics = {
  communities_reached: 12,
  patients_treated: 3840,
  meals_served: 9200,
  children_supported: 1450,
};

const values = [
  {
    icon: Heart,
    title: "Dignity",
    desc: "Every person we serve is treated with respect, privacy and warmth, never as a statistic.",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "Donors and partners see exactly where support goes, through mission reports and live impact figures.",
  },
  {
    icon: ShieldCheck,
    title: "Clinical Excellence",
    desc: "Medical outreach is guided by the governance and standards of Regal Plastic Surgery Centre.",
  },
  {
    icon: Handshake,
    title: "Local Partnership",
    desc: "Village heads, youth leaders and grassroots NGOs help us decide where to go and how to serve.",
  },
];

const steps = [
  {
    icon: Megaphone,
    title: "A community is nominated",
    desc: "Village heads, youth leaders and local NGOs tell us about a community in need: its location, population and main challenges, from healthcare access to malnutrition and out-of-school children.",
  },
  {
    icon: Search,
    title: "We review and assess",
    desc: "Our team verifies each nomination and shortlists villages for a site assessment before any outreach is planned.",
  },
  {
    icon: Users,
    title: "A field team is assembled",
    desc: "Doctors, nurses, pharmacists, lab technicians, teachers, welfare and logistics volunteers are matched by specialty and location.",
  },
  {
    icon: Truck,
    title: "Resources are mobilised",
    desc: "Funds, medicines, food and school supplies come together through donations, in-kind gifts and corporate sponsorship.",
  },
  {
    icon: Stethoscope,
    title: "Outreach day",
    desc: "Free consultations, a hot meal drive, family food packages and school kits are delivered directly in the village.",
  },
  {
    icon: BarChart3,
    title: "We report back",
    desc: "Every mission is published with its numbers, photo gallery and field notes so supporters can see what their help achieved.",
  },
];

const programs = [
  {
    icon: Stethoscope,
    title: "Free Community Healthcare",
    img: IMG.healthcare,
    points: [
      "General consultations",
      "Eye and dental checks",
      "Free pharmacy",
      "Surgical referrals where needed",
    ],
  },
  {
    icon: Baby,
    title: "Maternal Wellness",
    img: IMG.maternal,
    points: ["Maternal care and advice", "Support for mothers and newborns", "Referral for complications"],
  },
  {
    icon: Utensils,
    title: "Feeding & Nutrition",
    img: IMG.feeding,
    points: ["Hot meal drives", "Family food relief packages", "Support for households facing food insecurity"],
  },
  {
    icon: GraduationCap,
    title: "Education for Kids",
    img: IMG.education,
    points: ["Scholarships and school fees", "Books, bags and uniforms", "Learning materials"],
  },
];

const spin = { animationDuration: "24s" } as CSSProperties;
const floatStyle = (rotate: string, delay?: string): CSSProperties =>
  ({ "--r": rotate, animationDelay: delay } as CSSProperties);

async function getImpact() {
  try {
    return (await api.getImpact()) || fallbackImpact;
  } catch {
    return fallbackImpact;
  }
}

export default async function AboutPage() {
  const metrics = await getImpact();
  const bandImages = [...IMG.band, ...IMG.band];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-regal-navy text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage
            src={IMG.hero}
            alt="Foundation team with a rural community"
            priority
            sizes="100vw"
            className="animate-kenburns opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-regal-navy via-regal-navy/85 to-regal-navy/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-regal-gold/30 via-transparent to-transparent" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="animate-fade-up mb-3 text-sm font-semibold uppercase tracking-widest text-regal-gold-light">
              About Us
            </p>
            <h1
              className="animate-fade-up font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
              style={{ animationDelay: "150ms" }}
            >
              Care that goes to the people, <span className="text-shimmer">not the other way round</span>
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-2xl text-lg text-white/80"
              style={{ animationDelay: "300ms" }}
            >
              We are the community outreach and humanitarian arm of Regal Plastic Surgery Centre,
              bringing free healthcare, nutrition and education support to rural villages across Nigeria.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-4"
              style={{ animationDelay: "450ms" }}
            >
              <Link href="/programs" className="btn-primary animate-pulse-ring">
                Our Programs <ArrowRight size={18} />
              </Link>
              <Link href="/get-involved" className="btn-outline-light">
                Get Involved
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex h-72 w-72 items-center justify-center md:h-80 md:w-80">
            <div
              className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-regal-gold/60"
              style={spin}
            />
            <div className="animate-float">
              <LogoBadge className="h-56 w-64 md:h-60 md:w-72" />
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right" className="relative">
            <div className="relative h-[420px] overflow-hidden rounded-3xl shadow-xl md:h-[520px]">
              <FoundationImage
                src={IMG.story1}
                alt="Volunteers and villagers during an outreach"
                className="transition duration-700 hover:scale-105"
              />
            </div>
            <div
              className="animate-float-slow absolute -bottom-8 -right-4 hidden h-44 w-44 overflow-hidden rounded-2xl border-4 border-white shadow-2xl md:block"
              style={floatStyle("3deg")}
            >
              <FoundationImage src={IMG.story2} alt="Children at a feeding drive" sizes="180px" />
            </div>
            <div className="animate-float absolute -left-3 top-8 flex items-center gap-2 rounded-full bg-regal-gold px-4 py-2 text-sm font-bold text-regal-navy shadow-lg">
              <MapPin size={16} /> Across Nigeria
            </div>
          </Reveal>

          <Reveal direction="left" delay={150}>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-forest">
              Our Story
            </p>
            <h2 className="section-heading">Why we go to the villages</h2>
            <div className="mt-6 space-y-5 leading-relaxed text-regal-charcoal">
              <p>
                The <strong>Regal Plastic Surgery Centre Foundation</strong> exists because the people
                who need care most are often the ones least able to reach it. Clinics sit in cities.
                The villages that need them are hours away, and the cost of the journey alone can be
                more than a family can spare.
              </p>
              <p>
                So rather than waiting for patients to find us, we take holistic humanitarian support
                to them: free primary and specialist medical outreach, feeding programs, and
                educational support for children, delivered in the community itself.
              </p>
              <p>
                Our belief is simple. Distance, poverty or lack of infrastructure should never decide
                who receives care.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border-l-4 border-regal-gold bg-white p-5 shadow-sm">
              <p className="font-display text-lg font-semibold text-regal-navy">
                Our mission: to extend dignified healthcare, nutrition and education support to
                communities that traditional systems often overlook, with transparency, clinical
                excellence and local partnership.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Scrolling photo band */}
      <section className="overflow-hidden bg-regal-navy py-4">
        <div className="animate-marquee flex w-max gap-4">
          {bandImages.map((src, i) => (
            <div
              key={i}
              className="relative h-32 w-48 shrink-0 overflow-hidden rounded-xl md:h-40 md:w-60"
            >
              <FoundationImage
                src={src}
                alt={`Foundation moment ${(i % IMG.band.length) + 1}`}
                sizes="240px"
                className="transition duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-forest">
              What Guides Us
            </p>
            <h2 className="section-heading">Four principles behind every outreach</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 120} direction="zoom">
                <div className="group h-full rounded-2xl bg-regal-cream p-6 ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:bg-regal-navy hover:shadow-xl">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-regal-gold text-regal-navy transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <v.icon size={26} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-regal-navy transition group-hover:text-white">
                    {v.title}
                  </h3>
                  <p className="text-sm text-regal-earth transition group-hover:text-white/80">
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we deliver */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <Reveal className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-forest">
            What We Deliver
          </p>
          <h2 className="section-heading">Health, hunger and learning, together</h2>
          <p className="mx-auto mt-3 max-w-2xl text-regal-earth">
            A clinic alone does not keep a child healthy if they are hungry or out of school. Each
            outreach addresses all three.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 150}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row">
                <div className="relative h-48 shrink-0 overflow-hidden sm:h-auto sm:w-2/5">
                  <FoundationImage
                    src={p.img}
                    alt={p.title}
                    sizes="(min-width: 640px) 20vw, 100vw"
                    className="transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-xl bg-regal-gold text-regal-navy shadow-lg transition group-hover:rotate-6">
                    <p.icon size={22} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-lg font-bold text-regal-navy">{p.title}</h3>
                  <ul className="space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-sm text-regal-earth">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-regal-forest" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href="/programs" className="btn-secondary">
            Explore all programs <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>

      {/* How an outreach happens */}
      <section className="bg-regal-navy py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 md:px-6 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-gold-light">
                How It Works
              </p>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                From a nomination to a village outreach
              </h2>
            </Reveal>
            <div className="relative mt-10">
              <div className="absolute bottom-6 left-6 top-6 w-0.5 bg-gradient-to-b from-regal-gold via-regal-sky to-white/10" />
              <ol className="space-y-8">
                {steps.map((s, i) => (
                  <li key={s.title}>
                    <Reveal delay={i * 100} direction="right" className="relative pl-20">
                      <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-regal-gold text-regal-navy shadow-lg ring-4 ring-regal-navy">
                        <s.icon size={22} />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-regal-gold-light">
                        Step {i + 1}
                      </p>
                      <h3 className="text-lg font-bold">{s.title}</h3>
                      <p className="mt-1 text-sm text-white/75">{s.desc}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <Reveal direction="left" className="lg:sticky lg:top-24">
            <div className="relative h-[420px] overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/10 md:h-[560px]">
              <FoundationImage
                src={IMG.process}
                alt="Outreach team at work in a village"
                className="animate-kenburns"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-regal-navy/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 text-regal-navy shadow-lg backdrop-blur">
                <p className="text-sm font-bold">Know a community that needs us?</p>
                <Link
                  href="/get-involved/nominate"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-regal-forest"
                >
                  Nominate a village <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Impact */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-14 md:grid-cols-4 md:px-6">
          {[
            { label: "Communities Reached", value: metrics.communities_reached },
            { label: "Patients Treated", value: metrics.patients_treated },
            { label: "Meals Served", value: metrics.meals_served },
            { label: "Children Supported", value: metrics.children_supported },
          ].map((m, i) => (
            <Reveal key={m.label} delay={i * 120} direction="zoom" className="text-center">
              <div className="font-display text-3xl font-bold text-regal-navy md:text-5xl">
                <CountUp value={m.value} />
              </div>
              <div className="mt-1 text-sm text-regal-earth">{m.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Clinical backing */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right" className="order-2 lg:order-1">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-forest">
              Connection to Regal Plastic Surgery Centre
            </p>
            <h2 className="section-heading">Clinical oversight you can trust</h2>
            <p className="mt-5 leading-relaxed text-regal-charcoal">
              The Foundation is the humanitarian arm of Regal Plastic Surgery Centre. Every outreach
              is backed by medical governance and leadership from the Centre, so the care delivered in
              a village meets the same professional standards as care delivered in a clinic.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                { icon: ShieldCheck, t: "Quality care", d: "Clinical protocols and supervision for every field team." },
                { icon: Building2, t: "Ethical standards", d: "Medical governance that keeps patient welfare first." },
                { icon: CheckCircle2, t: "Professional accountability", d: "Clear leadership responsible for what happens in the field." },
              ].map((b, i) => (
                <li key={b.t}>
                  <Reveal delay={i * 120}>
                    <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:translate-x-2 hover:shadow-md">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-regal-navy text-regal-gold-light">
                        <b.icon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-regal-navy">{b.t}</p>
                        <p className="text-sm text-regal-earth">{b.d}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal direction="left" delay={150} className="relative order-1 lg:order-2">
            <div className="relative h-[380px] overflow-hidden rounded-3xl shadow-xl md:h-[480px]">
              <FoundationImage
                src={IMG.clinic}
                alt="Medical team caring for a patient"
                className="transition duration-700 hover:scale-105"
              />
            </div>
            <div
              className="animate-float absolute -bottom-6 -left-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-regal-navy text-xl font-bold text-regal-gold-light shadow-2xl md:h-24 md:w-24"
              style={floatStyle("-4deg")}
            >
              RPSC
            </div>
          </Reveal>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-forest">
              Leadership
            </p>
            <h2 className="section-heading">Leadership &amp; Medical Advisory Board</h2>
            <p className="mx-auto mt-3 max-w-2xl text-regal-earth">
              Our work is overseen by clinicians and community leaders committed to equitable access to care.
            </p>
          </Reveal>

          {board.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {board.map((m, i) => (
                <Reveal key={m.name} delay={i * 120} direction="zoom">
                  <div className="group overflow-hidden rounded-2xl bg-regal-cream ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <div className="relative h-64 overflow-hidden">
                      <FoundationImage
                        src={m.img}
                        alt={m.name}
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="transition duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-regal-navy">{m.name}</h3>
                      <p className="text-sm font-semibold text-regal-forest">{m.role}</p>
                      {m.bio && <p className="mt-2 text-sm text-regal-earth">{m.bio}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Reveal key={i} delay={i * 120} direction="zoom">
                  <div className="rounded-2xl border-2 border-dashed border-regal-navy/20 bg-regal-cream p-8 text-center">
                    <div className="animate-float mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-regal-navy/10 text-regal-navy/50">
                      <User size={36} />
                    </div>
                    <p className="font-bold text-regal-navy">Profile coming soon</p>
                    <p className="mt-1 text-xs text-regal-earth">
                      Board details will be published as the Foundation scales.
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ethical storytelling */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <Reveal>
          <div className="grid gap-8 rounded-3xl bg-gradient-to-br from-regal-navy to-regal-sky p-8 text-white shadow-xl md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Our promise on photos, stories and data
              </h2>
              <p className="mt-3 max-w-2xl text-white/85">
                The people we serve are partners, not subjects. Every photo and story we share is
                chosen to show dignity, empowerment and genuine connection, and every form on this
                site follows Nigeria&apos;s NDPR data protection standards.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="animate-float flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Camera size={28} />
              </div>
              <div
                className="animate-float flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"
                style={{ animationDelay: "1s" }}
              >
                <Lock size={28} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden py-24 text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage
            src={IMG.cta}
            alt="Volunteers and children together"
            sizes="100vw"
            className="animate-kenburns"
          />
          <div className="absolute inset-0 bg-regal-navy/80" />
        </div>
        <Reveal className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-5xl">Be part of the story</h2>
          <p className="mt-3 text-white/85">
            Give, volunteer, or tell us about a community that needs care. Every action brings an
            outreach closer.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved/donate" className="btn-primary animate-pulse-ring">
              <Heart size={18} /> Donate Now
            </Link>
            <Link href="/get-involved/volunteer" className="btn-outline-light">
              Volunteer
            </Link>
            <Link href="/get-involved/nominate" className="btn-outline-light">
              Nominate a Community
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}