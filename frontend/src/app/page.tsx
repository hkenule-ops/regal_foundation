import Link from "next/link";
import type { CSSProperties } from "react";
import { Heart, Stethoscope, Utensils, GraduationCap, ArrowRight, MapPin } from "lucide-react";
import { api, type ImpactMetrics, type Mission, type Story } from "@/lib/api";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import FoundationImage from "@/components/FoundationImage";

async function getHomeData() {
  const [impact, upcoming, missions, stories] = await Promise.all([
    api.getImpact().catch(() => null),
    api.getUpcomingMissions().catch(() => [] as Mission[]),
    api.getMissions().catch(() => [] as Mission[]),
    api.getStories().catch(() => [] as Story[]),
  ]);
  return {
    impact,
    upcoming: upcoming || [],
    missions: missions || [],
    stories: stories || [],
  };
}

const fallbackImpact: ImpactMetrics = {
  communities_reached: 12,
  patients_treated: 3840,
  meals_served: 9200,
  children_supported: 1450,
};

/* Put your photos in /public/images/ using these names (or change the paths). */
const IMG = {
  hero: "/images/hero-outreach.jpg",
  heroA: "/images/hero-doctor.jpg",
  heroB: "/images/hero-children.jpg",
  heroC: "/images/hero-feeding.jpg",
  healthcare: "/images/pillar-healthcare.jpg",
  feeding: "/images/pillar-feeding.jpg",
  education: "/images/pillar-education.jpg",
  mission: "/images/mission-bg.jpg",
  cta: "/images/cta-bg.jpg",
  gallery: [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
    "/images/gallery-5.jpg",
    "/images/gallery-6.jpg",
    "/images/gallery-7.jpg",
    "/images/gallery-8.jpg",
  ],
};

/** Only trust absolute URLs or site-relative paths coming from the API. */
function usable(src?: string | null): src is string {
  return !!src && (/^https?:\/\//i.test(src) || src.startsWith("/"));
}

const float = (rotate: string, delay?: string): CSSProperties =>
  ({ "--r": rotate, animationDelay: delay } as CSSProperties);

export default async function HomePage() {
  const { impact, upcoming, missions, stories } = await getHomeData();
  const metrics = impact || fallbackImpact;
  const nextMission = upcoming[0];

  // Real photos from missions/stories first, local placeholders fill the rest.
  const real = Array.from(
    new Set(
      [
        ...missions.flatMap((m) => [...(m.gallery || []), m.cover_image]),
        ...stories.map((s) => s.cover_image),
      ].filter(usable)
    )
  );
  const gallery = Array.from({ length: 8 }, (_, i) => real[i] ?? IMG.gallery[i]);
  const marqueeImages = [...gallery, ...gallery];

  const missionBg = usable(nextMission?.cover_image) ? nextMission.cover_image : IMG.mission;
  const featuredStories = stories.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-regal-navy text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage
            src={IMG.hero}
            alt="Foundation volunteers at a rural community outreach"
            priority
            sizes="100vw"
            className="animate-kenburns opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-regal-navy via-regal-navy/85 to-regal-navy/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-regal-gold/25 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-2">
          <div className="max-w-2xl">
            <p className="animate-fade-up mb-3 text-sm font-semibold uppercase tracking-widest text-regal-gold">
              Regal Plastic Surgery Centre Foundation
            </p>
            <h1
              className="animate-fade-up font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
              style={{ animationDelay: "150ms" }}
            >
              Healthcare, nutrition &amp; education — delivered to the villages that{" "}
              <span className="text-shimmer">need them most</span>
            </h1>
            <p
              className="animate-fade-up mt-5 text-lg text-white/80"
              style={{ animationDelay: "300ms" }}
            >
              We take free medical outreach, feeding drives, and school support directly to rural
              communities across Nigeria — so no one is left behind.
            </p>
            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-4"
              style={{ animationDelay: "450ms" }}
            >
              <Link href="/get-involved/donate" className="btn-primary animate-pulse-ring">
                <Heart size={18} /> Support an Outreach
              </Link>
              <Link href="/get-involved/volunteer" className="btn-outline-light">
                Join as a Volunteer
              </Link>
            </div>
          </div>

          {/* Floating photo collage */}
          <div className="relative hidden h-[480px] lg:block">
            <div
              className="animate-float absolute left-4 top-0 h-64 w-52 overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl"
              style={float("-4deg")}
            >
              <FoundationImage src={IMG.heroA} alt="Doctor treating a patient" sizes="220px" />
            </div>
            <div
              className="animate-float-slow absolute right-0 top-10 h-72 w-56 overflow-hidden rounded-3xl border-4 border-regal-gold/60 shadow-2xl"
              style={float("3deg")}
            >
              <FoundationImage src={IMG.heroB} alt="Children with school supplies" sizes="240px" />
            </div>
            <div
              className="animate-float absolute bottom-0 left-24 h-60 w-60 overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl"
              style={float("2deg", "1.2s")}
            >
              <FoundationImage src={IMG.heroC} alt="Hot meal drive for families" sizes="260px" />
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling photo strip */}
      <section className="overflow-hidden bg-regal-navy py-4">
        <div className="animate-marquee flex w-max gap-4">
          {marqueeImages.map((src, i) => (
            <div
              key={i}
              className="relative h-32 w-48 shrink-0 overflow-hidden rounded-xl md:h-40 md:w-60"
            >
              <FoundationImage
                src={src}
                alt={`Outreach moment ${(i % gallery.length) + 1}`}
                sizes="240px"
                className="transition duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Impact counters */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4 md:px-6">
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

      {/* Three pillars */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <Reveal className="mb-10 text-center">
          <h2 className="section-heading">Our Three Core Pillars</h2>
          <p className="mx-auto mt-3 max-w-2xl text-regal-earth">
            Holistic community intervention — not just clinics, but full support for health, hunger, and learning.
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Stethoscope,
              title: "Free Community Healthcare",
              desc: "General consultations, eye & dental checks, maternal care, free pharmacy, and surgical referrals where needed.",
              href: "/programs#healthcare",
              img: IMG.healthcare,
            },
            {
              icon: Utensils,
              title: "Feeding & Nutrition",
              desc: "Hot meal drives and family food relief packages for households facing acute food insecurity.",
              href: "/programs#feeding",
              img: IMG.feeding,
            },
            {
              icon: GraduationCap,
              title: "Education for Kids",
              desc: "Scholarships, school fees, books, bags, uniforms, and learning materials so children stay in school.",
              href: "/programs#education",
              img: IMG.education,
            },
          ].map((p, i) => (
            <Reveal key={p.title} delay={i * 150}>
              <Link
                href={p.href}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <FoundationImage
                    src={p.img}
                    alt={p.title}
                    className="transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-regal-navy/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-regal-gold text-regal-navy transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <p.icon size={24} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-regal-navy transition group-hover:text-regal-gold">
                    {p.title}
                  </h3>
                  <p className="text-sm text-regal-earth">{p.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-regal-gold">
                    Learn more{" "}
                    <ArrowRight size={14} className="transition group-hover:translate-x-2" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Photo gallery */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-10 text-center">
            <h2 className="section-heading">Moments From the Field</h2>
            <p className="mx-auto mt-3 max-w-2xl text-regal-earth">
              Every photo is a family reached, a child back in school, a meal shared.
            </p>
          </Reveal>
          <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4">
            {gallery.map((src, i) => {
              const span =
                i === 0
                  ? "md:col-span-2 md:row-span-2"
                  : i === 5
                  ? "md:row-span-2"
                  : i === 6
                  ? "md:col-span-2"
                  : "";
              return (
                <Reveal
                  key={`${src}-${i}`}
                  delay={(i % 4) * 100}
                  direction="zoom"
                  className={`group relative overflow-hidden rounded-2xl ${span}`}
                >
                  <FoundationImage
                    src={src}
                    alt={`Outreach gallery photo ${i + 1}`}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="transition duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-regal-navy/0 transition duration-300 group-hover:bg-regal-navy/30" />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Next outreach spotlight */}
      {nextMission && (
        <section className="relative isolate overflow-hidden bg-regal-navy text-white">
          <div className="absolute inset-0 -z-10">
            <FoundationImage
              src={missionBg}
              alt="Upcoming outreach community"
              sizes="100vw"
              className="animate-kenburns opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-regal-navy via-regal-navy/90 to-regal-navy/50" />
          </div>
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-16 md:flex-row md:items-center md:px-6">
            <Reveal direction="right">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-regal-gold">
                Next Outreach
              </p>
              <h2 className="font-display text-2xl font-bold md:text-4xl">{nextMission.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} /> {nextMission.target_lga || nextMission.target_state},{" "}
                  {nextMission.target_state}
                </span>
                <span>·</span>
                <span>
                  {new Date(nextMission.start_date).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              {nextMission.fundraising_goal && (
                <div className="mt-4 max-w-md">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>Raised ₦{nextMission.fundraising_raised.toLocaleString()}</span>
                    <span>Goal ₦{nextMission.fundraising_goal.toLocaleString()}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-regal-gold to-regal-gold-light"
                      style={{
                        width: `${Math.min(
                          100,
                          (nextMission.fundraising_raised / nextMission.fundraising_goal) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </Reveal>
            <Reveal direction="left" delay={150}>
              <Link
                href={`/missions/${nextMission.id}`}
                className="btn-primary shrink-0 animate-pulse-ring"
              >
                Sponsor This Mission
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Latest field stories (real data only; hidden when there are none) */}
      {featuredStories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <Reveal className="mb-10 text-center">
            <h2 className="section-heading">Latest From the Field</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredStories.map((s, i) => (
              <Reveal key={s.id} delay={i * 150}>
                <Link
                  href={`/stories/${s.slug}`}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-52 overflow-hidden">
                    <FoundationImage
                      src={usable(s.cover_image) ? s.cover_image : null}
                      alt={s.title}
                      className="transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-regal-navy transition group-hover:text-regal-gold">
                      {s.title}
                    </h3>
                    {s.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-regal-earth">{s.excerpt}</p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-regal-gold">
                      Read more{" "}
                      <ArrowRight size={14} className="transition group-hover:translate-x-2" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Institutional backing */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <Reveal>
          <div className="card flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-regal-navy text-xl font-bold text-regal-gold transition duration-500 hover:rotate-6 hover:scale-110">
              RPSC
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-regal-navy">
                Clinical oversight by Regal Plastic Surgery Centre
              </h3>
              <p className="mt-1 text-sm text-regal-earth">
                Every outreach is backed by medical governance and leadership from Regal Plastic Surgery
                Centre — ensuring quality care, ethical standards, and professional accountability in the field.
              </p>
            </div>
            <Link href="/about" className="btn-secondary shrink-0 text-sm">
              Our Story
            </Link>
          </div>
        </Reveal>
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
          <div className="absolute inset-0 bg-regal-navy/75" />
        </div>
        <Reveal className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-5xl">Join us in the field</h2>
          <p className="mt-3 text-white/85">
            Whether you give, volunteer, or nominate a community — every action brings care closer to those who need it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved/donate" className="btn-primary animate-pulse-ring">
              Donate Now
            </Link>
            <Link href="/get-involved" className="btn-outline-light">
              See All Ways to Help
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}