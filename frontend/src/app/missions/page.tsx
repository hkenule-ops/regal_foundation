import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ArrowRight,
  Camera,
  Stethoscope,
  Utensils,
  BookOpen,
  Heart,
  Megaphone,
  Search,
} from "lucide-react";
import { api, type ImpactMetrics, type Mission } from "@/lib/api";
import { usable, formatDate } from "@/lib/media";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Countdown from "@/components/Countdown";
import ProgressBar from "@/components/ProgressBar";
import FoundationImage from "@/components/FoundationImage";

export const metadata: Metadata = {
  title: "Missions & Impact",
  description:
    "Upcoming outreaches you can sponsor and past mission reports with real numbers: patients treated, meals served and school kits distributed.",
};

/* Put your photos in /public/images/ using these names (or change the paths). */
const IMG = {
  hero: "/images/missions-hero.jpg",
  cta: "/images/missions-cta.jpg",
};

type Props = { searchParams: Promise<{ year?: string; state?: string }> };

async function getData() {
  const [missions, impact] = await Promise.all([
    api.getMissions("limit=100").catch(() => [] as Mission[]),
    api.getImpact().catch(() => null as ImpactMetrics | null),
  ]);
  return { missions: missions || [], impact };
}

const byStartAsc = (a: Mission, b: Mission) =>
  new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
const byStartDesc = (a: Mission, b: Mission) => byStartAsc(b, a);

function StatusBadge({ status }: { status: string }) {
  if (status === "ongoing") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-regal-gold px-3 py-1 text-xs font-bold text-regal-navy">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-regal-navy opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-regal-navy" />
        </span>
        Happening now
      </span>
    );
  }
  const label = status === "upcoming" ? "Upcoming" : status === "completed" ? "Completed" : status;
  return (
    <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-bold capitalize text-regal-navy">
      {label}
    </span>
  );
}

function UpcomingCard({ m, i }: { m: Mission; i: number }) {
  const pct = m.fundraising_goal ? (m.fundraising_raised / m.fundraising_goal) * 100 : 0;
  const services = m.planned_services || [];
  return (
    <Reveal delay={(i % 3) * 120}>
      <Link
        href={`/missions/${m.id}`}
        className="group block h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
      >
        <div className="relative h-48 overflow-hidden">
          <FoundationImage
            src={usable(m.cover_image) ? m.cover_image : null}
            alt={m.title}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-regal-navy/60 via-transparent to-transparent" />
          <div className="absolute left-3 top-3">
            <StatusBadge status={m.status} />
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-regal-navy transition group-hover:text-regal-forest">
            {m.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-regal-earth">
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {m.target_state}
              {m.target_lga ? `, ${m.target_lga}` : ""}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} /> {formatDate(m.start_date, { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          {services.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {services.slice(0, 4).map((s) => (
                <span key={s} className="rounded-full bg-regal-cream px-2.5 py-1 text-xs text-regal-earth">
                  {s}
                </span>
              ))}
              {services.length > 4 && (
                <span className="rounded-full bg-regal-cream px-2.5 py-1 text-xs text-regal-earth">
                  +{services.length - 4} more
                </span>
              )}
            </div>
          )}
          {m.fundraising_goal ? (
            <div className="mt-4">
              <ProgressBar percent={pct} trackClassName="bg-gray-200" />
              <p className="mt-1.5 text-xs text-regal-charcoal">
                ₦{m.fundraising_raised.toLocaleString()} raised of ₦{m.fundraising_goal.toLocaleString()}
              </p>
            </div>
          ) : null}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-regal-forest">
            Sponsor this mission{" "}
            <ArrowRight size={14} className="transition group-hover:translate-x-2" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

function PastCard({ m, i }: { m: Mission; i: number }) {
  const photos = (m.gallery || []).filter(usable).length;
  const stats = [
    { icon: Stethoscope, value: m.patients_consulted, label: "patients" },
    { icon: Utensils, value: m.meals_distributed, label: "meals" },
    { icon: BookOpen, value: m.school_kits_handed, label: "school kits" },
  ];
  return (
    <Reveal delay={(i % 3) * 120} direction="zoom">
      <Link
        href={`/missions/${m.id}`}
        className="group block h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
      >
        <div className="relative h-52 overflow-hidden">
          <FoundationImage
            src={usable(m.cover_image) ? m.cover_image : (m.gallery || []).find(usable) ?? null}
            alt={m.title}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-regal-navy/70 via-transparent to-transparent" />
          {photos > 0 && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur">
              <Camera size={12} /> {photos}
            </span>
          )}
          <p className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-wider text-white/90">
            {formatDate(m.start_date, { month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-regal-navy transition group-hover:text-regal-forest">
            {m.title}
          </h3>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-regal-earth">
            <MapPin size={12} /> {m.target_state}
            {m.target_lga ? `, ${m.target_lga}` : ""}
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {stats.map(
              (s) =>
                s.value != null && (
                  <div key={s.label} className="rounded-xl bg-regal-cream p-2 text-center">
                    <s.icon size={16} className="mx-auto text-regal-forest" />
                    <div className="mt-1 text-sm font-bold text-regal-navy">{s.value.toLocaleString()}</div>
                    <div className="text-[10px] text-regal-earth">{s.label}</div>
                  </div>
                )
            )}
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-regal-forest">
            Read the report <ArrowRight size={14} className="transition group-hover:translate-x-2" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default async function MissionsPage({ searchParams }: Props) {
  const { year, state } = await searchParams;
  const { missions, impact } = await getData();

  const active = missions
    .filter((m) => m.status === "upcoming" || m.status === "ongoing")
    .sort(byStartAsc);
  const past = missions.filter((m) => m.status === "completed").sort(byStartDesc);

  const featured = active.find((m) => m.status === "ongoing") ?? active[0];
  const moreActive = active.filter((m) => m.id !== featured?.id);

  const years = Array.from(new Set(past.map((m) => new Date(m.start_date).getFullYear()))).sort(
    (a, b) => b - a
  );
  const states = Array.from(new Set(past.map((m) => m.target_state))).sort();
  const filteredPast = past.filter(
    (m) =>
      (!year || String(new Date(m.start_date).getFullYear()) === year) &&
      (!state || m.target_state === state)
  );
  const filtering = !!(year || state);

  const stats = [
    { label: "Missions Completed", value: past.length },
    ...(impact
      ? [
          { label: "Communities Reached", value: impact.communities_reached },
          { label: "Patients Treated", value: impact.patients_treated },
          { label: "Meals Served", value: impact.meals_served },
          { label: "Children Supported", value: impact.children_supported },
        ]
      : []),
  ];
  const showStats = impact || past.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-regal-navy text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage
            src={IMG.hero}
            alt="Outreach team arriving in a village"
            priority
            sizes="100vw"
            className="animate-kenburns opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-regal-navy via-regal-navy/85 to-regal-navy/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-regal-gold/30 via-transparent to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <p className="animate-fade-up mb-3 text-sm font-semibold uppercase tracking-widest text-regal-gold-light">
            Missions &amp; Impact
          </p>
          <h1
            className="animate-fade-up max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            style={{ animationDelay: "150ms" }}
          >
            Field work <span className="text-shimmer">you can verify</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg text-white/80"
            style={{ animationDelay: "300ms" }}
          >
            Upcoming outreaches you can sponsor, and past mission reports with real numbers: patients
            treated, meals served and school kits distributed.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap gap-4"
            style={{ animationDelay: "450ms" }}
          >
            <a href="#upcoming" className="btn-primary animate-pulse-ring">
              <Heart size={18} /> Sponsor a Mission
            </a>
            <a href="#archive" className="btn-outline-light">
              Browse Past Reports
            </a>
          </div>
        </div>
      </section>

      {/* Cumulative metrics */}
      {showStats && (
        <section className="border-b border-gray-200 bg-white">
          <div
            className={`mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:px-6 ${
              stats.length >= 5 ? "md:grid-cols-5" : "md:grid-cols-1"
            }`}
          >
            {stats.map((m, i) => (
              <Reveal key={m.label} delay={i * 100} direction="zoom" className="text-center">
                <div className="font-display text-3xl font-bold text-regal-navy md:text-4xl">
                  <CountUp value={m.value} />
                </div>
                <div className="mt-1 text-sm text-regal-earth">{m.label}</div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section id="upcoming" className="scroll-mt-24">
        {featured ? (
          <div className="relative isolate overflow-hidden bg-regal-navy text-white">
            <div className="absolute inset-0 -z-10">
              <FoundationImage
                src={usable(featured.cover_image) ? featured.cover_image : IMG.hero}
                alt={featured.title}
                sizes="100vw"
                className="animate-kenburns opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-regal-navy via-regal-navy/90 to-regal-navy/60" />
            </div>
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-2">
              <Reveal direction="right">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-regal-gold-light">
                  {featured.status === "ongoing" ? "Happening Now" : "Next Outreach"}
                </p>
                <h2 className="font-display text-3xl font-bold md:text-5xl">{featured.title}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/75">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} /> {featured.target_lga ? `${featured.target_lga}, ` : ""}
                    {featured.target_state}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={14} /> {formatDate(featured.start_date)}
                  </span>
                </div>
                {featured.description && (
                  <p className="mt-4 max-w-xl text-white/80">{featured.description}</p>
                )}
                {featured.planned_services?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {featured.planned_services.map((s) => (
                      <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </Reveal>

              <Reveal direction="left" delay={150}>
                {featured.status === "upcoming" && (
                  <div className="mb-6">
                    <p className="mb-3 text-sm font-semibold text-white/80">Outreach starts in</p>
                    <Countdown target={featured.start_date} />
                  </div>
                )}
                {featured.fundraising_goal ? (
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                    <div className="mb-2 flex items-end justify-between">
                      <span className="text-sm text-white/75">Raised so far</span>
                      <span className="font-display text-2xl font-bold text-regal-gold-light">
                        ₦{featured.fundraising_raised.toLocaleString()}
                      </span>
                    </div>
                    <ProgressBar
                      percent={(featured.fundraising_raised / featured.fundraising_goal) * 100}
                    />
                    <p className="mt-2 text-xs text-white/70">
                      Goal ₦{featured.fundraising_goal.toLocaleString()}
                    </p>
                  </div>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/missions/${featured.id}`} className="btn-primary animate-pulse-ring">
                    <Heart size={18} /> Sponsor This Mission
                  </Link>
                  <Link href={`/missions/${featured.id}`} className="btn-outline-light">
                    Mission details
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <Reveal>
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
                <div className="animate-float mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-regal-gold/20 text-regal-forest">
                  <Calendar size={30} />
                </div>
                <h2 className="font-display text-2xl font-bold text-regal-navy">
                  No upcoming missions scheduled yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-regal-earth">
                  Check back soon, or tell us about a community that needs care.
                </p>
                <Link href="/get-involved/nominate" className="btn-primary mt-6">
                  <Megaphone size={18} /> Nominate a Community
                </Link>
              </div>
            </Reveal>
          </div>
        )}

        {moreActive.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <Reveal className="mb-8">
              <h2 className="section-heading">More Upcoming Missions</h2>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {moreActive.map((m, i) => (
                <UpcomingCard key={m.id} m={m} i={i} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Past archive */}
      <section id="archive" className="scroll-mt-24 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Reveal className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-regal-forest">
              Past Missions Archive
            </p>
            <h2 className="section-heading">Every outreach, on the record</h2>
            <p className="mx-auto mt-3 max-w-2xl text-regal-earth">
              Each report shows the services delivered, photos from the field and notes from the team.
            </p>
          </Reveal>

          {past.length > 0 && (
            <Reveal>
              <form
                action="/missions#archive"
                method="get"
                className="mx-auto mb-10 flex max-w-2xl flex-wrap items-end justify-center gap-3 rounded-2xl bg-regal-cream p-4 ring-1 ring-black/5"
              >
                <div className="min-w-[140px] flex-1">
                  <label htmlFor="year" className="label">Year</label>
                  <select id="year" name="year" defaultValue={year ?? ""} className="input">
                    <option value="">All years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="min-w-[140px] flex-1">
                  <label htmlFor="state" className="label">State</label>
                  <select id="state" name="state" defaultValue={state ?? ""} className="input">
                    <option value="">All states</option>
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary">
                  <Search size={16} /> Filter
                </button>
                {filtering && (
                  <Link href="/missions#archive" className="btn-secondary">
                    Clear
                  </Link>
                )}
              </form>
            </Reveal>
          )}

          {filteredPast.length === 0 ? (
            <Reveal>
              <div className="mx-auto max-w-xl rounded-3xl bg-regal-cream p-10 text-center">
                <div className="animate-float mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-regal-navy/10 text-regal-navy/60">
                  <Camera size={30} />
                </div>
                <p className="font-bold text-regal-navy">
                  {filtering ? "No missions match those filters" : "Reports are coming soon"}
                </p>
                <p className="mt-1 text-sm text-regal-earth">
                  {filtering
                    ? "Try a different year or state."
                    : "Mission reports and photo galleries will appear here after field deployments."}
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPast.map((m, i) => (
                <PastCard key={m.id} m={m} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden py-24 text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage src={IMG.cta} alt="Volunteers and children together" sizes="100vw" className="animate-kenburns" />
          <div className="absolute inset-0 bg-regal-navy/80" />
        </div>
        <Reveal className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-5xl">Help us reach the next village</h2>
          <p className="mt-3 text-white/85">
            Sponsor an outreach, volunteer your skills, or nominate a community that has been overlooked.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved/donate" className="btn-primary animate-pulse-ring">
              <Heart size={18} /> Donate Now
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