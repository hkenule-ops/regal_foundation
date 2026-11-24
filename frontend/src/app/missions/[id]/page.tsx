import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Utensils,
  BookOpen,
  Heart,
  Camera,
  NotebookPen,
} from "lucide-react";
import { api, type Mission } from "@/lib/api";
import { usable, formatDate } from "@/lib/media";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Countdown from "@/components/Countdown";
import ProgressBar from "@/components/ProgressBar";
import FoundationImage from "@/components/FoundationImage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const m = await api.getMission(id);
    return { title: m.title, description: m.description };
  } catch {
    return { title: "Mission" };
  }
}

export default async function MissionDetailPage({ params }: Props) {
  const { id } = await params;
  let mission: Mission;
  try {
    mission = await api.getMission(id);
  } catch {
    notFound();
  }

  const isActive = mission.status === "upcoming" || mission.status === "ongoing";
  const isCompleted = mission.status === "completed";
  const gallery = (mission.gallery || []).filter(usable);
  const heroImage = usable(mission.cover_image) ? mission.cover_image : gallery[0] ?? null;
  const pct = mission.fundraising_goal
    ? (mission.fundraising_raised / mission.fundraising_goal) * 100
    : 0;

  const stats = [
    { icon: Stethoscope, label: "Patients consulted", value: mission.patients_consulted },
    { icon: Utensils, label: "Meals distributed", value: mission.meals_distributed },
    { icon: BookOpen, label: "School kits handed out", value: mission.school_kits_handed },
  ].filter((s) => s.value != null);

  const statusLabel =
    mission.status === "ongoing"
      ? "Happening now"
      : mission.status.charAt(0).toUpperCase() + mission.status.slice(1);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-regal-navy text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage
            src={heroImage}
            alt={mission.title}
            priority
            sizes="100vw"
            className="animate-kenburns opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-regal-navy via-regal-navy/85 to-regal-navy/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-regal-gold/30 via-transparent to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <Link
            href="/missions"
            className="animate-fade-up group inline-flex items-center gap-2 text-sm font-medium text-regal-gold-light"
          >
            <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /> All Missions
          </Link>
          <div className="animate-fade-up mt-4" style={{ animationDelay: "100ms" }}>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                mission.status === "ongoing"
                  ? "animate-pulse-ring bg-regal-gold text-regal-navy"
                  : "bg-white/90 text-regal-navy"
              }`}
            >
              {statusLabel}
            </span>
          </div>
          <h1
            className="animate-fade-up mt-4 max-w-4xl font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            style={{ animationDelay: "200ms" }}
          >
            {mission.title}
          </h1>
          <div
            className="animate-fade-up mt-5 flex flex-wrap gap-5 text-white/80"
            style={{ animationDelay: "350ms" }}
          >
            <span className="inline-flex items-center gap-2">
              <MapPin size={18} className="text-regal-gold-light" />
              {mission.target_lga ? `${mission.target_lga}, ` : ""}
              {mission.target_state}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar size={18} className="text-regal-gold-light" />
              {formatDate(mission.start_date)}
              {mission.end_date &&
                ` – ${formatDate(mission.end_date, { day: "numeric", month: "long" })}`}
            </span>
          </div>
          {mission.status === "upcoming" && (
            <div className="animate-fade-up mt-8 max-w-md" style={{ animationDelay: "500ms" }}>
              <p className="mb-3 text-sm font-semibold text-white/80">Outreach starts in</p>
              <Countdown target={mission.start_date} />
            </div>
          )}
        </div>
      </section>

      {/* Impact stats (completed missions) */}
      {isCompleted && stats.length > 0 && (
        <section className="border-b border-gray-200 bg-white">
          <div
            className={`mx-auto grid max-w-5xl gap-6 px-4 py-12 md:px-6 ${
              stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3"
            }`}
          >
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 120} direction="zoom">
                <div className="rounded-2xl bg-regal-cream p-6 text-center ring-1 ring-black/5">
                  <s.icon size={28} className="mx-auto text-regal-forest" />
                  <div className="mt-3 font-display text-4xl font-bold text-regal-navy md:text-5xl">
                    <CountUp value={s.value as number} suffix="" />
                  </div>
                  <div className="mt-1 text-sm text-regal-earth">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Body */}
      <section className="mx-auto max-w-5xl space-y-14 px-4 py-14 md:px-6 md:py-20">
        {mission.description && (
          <Reveal>
            <h2 className="section-heading">About this mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-regal-charcoal">{mission.description}</p>
          </Reveal>
        )}

        {mission.planned_services?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-regal-navy">
              {isCompleted ? "Services delivered" : "Planned services"}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mission.planned_services.map((s, i) => (
                <li key={s}>
                  <Reveal delay={(i % 3) * 100} direction="zoom">
                    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
                      <CheckCircle2 size={20} className="shrink-0 text-regal-forest" />
                      <span className="text-sm font-medium text-regal-charcoal">{s}</span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        )}

        {gallery.length > 0 && (
          <div>
            <Reveal>
              <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-regal-navy">
                <Camera size={22} className="text-regal-forest" /> Photo gallery
              </h2>
            </Reveal>
            <div className="mt-5 grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-3">
              {gallery.map((src, i) => (
                <Reveal
                  key={`${src}-${i}`}
                  delay={(i % 3) * 100}
                  direction="zoom"
                  className={`group relative overflow-hidden rounded-2xl ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <FoundationImage
                    src={src}
                    alt={`${mission.title} photo ${i + 1}`}
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="transition duration-700 group-hover:scale-110"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {mission.field_notes && (
          <Reveal>
            <div className="rounded-3xl border-l-4 border-regal-gold bg-white p-8 shadow-sm ring-1 ring-black/5">
              <h2 className="inline-flex items-center gap-2 text-xl font-bold text-regal-navy">
                <NotebookPen size={20} className="text-regal-forest" /> Field notes
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-regal-charcoal">
                {mission.field_notes}
              </p>
            </div>
          </Reveal>
        )}

        {/* Sponsor card */}
        {isActive && (
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-regal-navy to-regal-sky p-8 text-white shadow-xl md:p-12">
              <Heart
                size={180}
                className="animate-float absolute -bottom-10 -right-6 text-white/10"
              />
              <h2 className="relative font-display text-3xl font-bold">Sponsor this mission</h2>
              <p className="relative mt-2 max-w-xl text-white/85">
                Your gift funds medications, meals and school kits for this specific outreach.
              </p>
              {mission.fundraising_goal ? (
                <div className="relative mt-6 max-w-md">
                  <div className="mb-2 flex items-end justify-between">
                    <span className="font-display text-3xl font-bold text-regal-gold-light">
                      ₦{mission.fundraising_raised.toLocaleString()}
                    </span>
                    <span className="text-sm text-white/75">
                      of ₦{mission.fundraising_goal.toLocaleString()} ({Math.min(100, Math.round(pct))}%)
                    </span>
                  </div>
                  <ProgressBar percent={pct} />
                </div>
              ) : null}
              <Link
                href="/get-involved/donate"
                className="btn-primary animate-pulse-ring relative mt-8 inline-flex"
              >
                <Heart size={18} /> Donate to This Mission
              </Link>
            </div>
          </Reveal>
        )}

        <Reveal className="text-center">
          <Link href="/missions" className="btn-secondary">
            See all missions <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}