import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, Heart, BookOpen, Camera, ShieldCheck } from "lucide-react";
import { api, type Story } from "@/lib/api";
import { usable, formatDate, readingMinutes } from "@/lib/media";
import Reveal from "@/components/Reveal";
import FoundationImage from "@/components/FoundationImage";

export const metadata: Metadata = {
  title: "Field Stories",
  description:
    "Mission recaps, beneficiary spotlights and community voices: human-centered reporting from our outreaches across Nigeria.",
};

/* Put your photos in /public/images/ using these names (or change the paths). */
const IMG = {
  hero: "/images/stories-hero.jpg",
  cta: "/images/stories-cta.jpg",
};

type Props = { searchParams: Promise<{ tag?: string }> };

async function getStories() {
  try {
    return (await api.getStories("limit=50")) || [];
  } catch {
    return [] as Story[];
  }
}

function TagPills({ tags, light = false }: { tags: string[]; light?: boolean }) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, 3).map((t) => (
        <span
          key={t}
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            light ? "bg-white/15 text-white backdrop-blur" : "bg-regal-gold/20 text-regal-forest"
          }`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Meta({ s, light = false }: { s: Story; light?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-4 text-xs ${
        light ? "text-white/75" : "text-regal-earth"
      }`}
    >
      <span className="inline-flex items-center gap-1">
        <Calendar size={12} /> {formatDate(s.created_at, { day: "numeric", month: "short", year: "numeric" })}
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock size={12} /> {readingMinutes(s.content)} min read
      </span>
    </div>
  );
}

export default async function StoriesPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const all = await getStories();

  const tags = Array.from(new Set(all.flatMap((s) => s.tags))).sort();
  const stories = tag ? all.filter((s) => s.tags.includes(tag)) : all;
  const [featured, ...rest] = stories;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-regal-navy text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage
            src={IMG.hero}
            alt="Community members sharing their stories"
            priority
            sizes="100vw"
            className="animate-kenburns opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-regal-navy via-regal-navy/85 to-regal-navy/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-regal-gold/30 via-transparent to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <p className="animate-fade-up mb-3 text-sm font-semibold uppercase tracking-widest text-regal-gold-light">
            Field Stories
          </p>
          <h1
            className="animate-fade-up max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            style={{ animationDelay: "150ms" }}
          >
            Stories from <span className="text-shimmer">the field</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-2xl text-lg text-white/80"
            style={{ animationDelay: "300ms" }}
          >
            Mission recaps, beneficiary spotlights and community voices: human-centered reporting from
            our outreaches.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap gap-4"
            style={{ animationDelay: "450ms" }}
          >
            <Link href="/missions" className="btn-primary animate-pulse-ring">
              See Our Missions <ArrowRight size={18} />
            </Link>
            <Link href="/get-involved/donate" className="btn-outline-light">
              <Heart size={18} /> Support the Work
            </Link>
          </div>
        </div>
      </section>

      {/* Tag filters */}
      {tags.length > 0 && (
        <nav
          aria-label="Filter stories by topic"
          className="sticky top-16 z-40 border-b border-regal-navy/10 bg-white/90 backdrop-blur"
        >
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 md:px-6">
            <Link
              href="/stories"
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                !tag
                  ? "border-regal-gold bg-regal-gold text-regal-navy"
                  : "border-regal-navy/15 text-regal-navy hover:border-regal-gold hover:bg-regal-gold/20"
              }`}
            >
              All stories
            </Link>
            {tags.map((t) => (
              <Link
                key={t}
                href={`/stories?tag=${encodeURIComponent(t)}`}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  tag === t
                    ? "border-regal-gold bg-regal-gold text-regal-navy"
                    : "border-regal-navy/15 text-regal-navy hover:border-regal-gold hover:bg-regal-gold/20"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        {!featured ? (
          <Reveal>
            <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
              <div className="animate-float mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-regal-gold/20 text-regal-forest">
                <BookOpen size={30} />
              </div>
              <h2 className="font-display text-2xl font-bold text-regal-navy">
                {tag ? "No stories under that topic yet" : "Our first field stories are on the way"}
              </h2>
              <p className="mt-2 text-regal-earth">
                {tag
                  ? "Try another topic, or view all stories."
                  : "Field stories and photo reports will be published here after missions. Check back soon."}
              </p>
              <Link href={tag ? "/stories" : "/missions"} className="btn-primary mt-6">
                {tag ? "All stories" : "See upcoming missions"}
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            {/* Featured */}
            <Reveal>
              <Link
                href={`/stories/${featured.slug}`}
                className="group relative grid overflow-hidden rounded-3xl bg-regal-navy text-white shadow-xl lg:grid-cols-2"
              >
                <div className="relative h-72 overflow-hidden lg:h-auto lg:min-h-[420px]">
                  <FoundationImage
                    src={usable(featured.cover_image) ? featured.cover_image : null}
                    alt={featured.title}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-regal-gold px-3 py-1 text-xs font-bold text-regal-navy">
                    {tag ? "Latest" : "Featured"}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <TagPills tags={featured.tags} light />
                  <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-4 line-clamp-4 text-white/80">{featured.excerpt}</p>
                  )}
                  <div className="mt-5">
                    <Meta s={featured} light />
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-regal-gold-light">
                    Read the story{" "}
                    <ArrowRight size={16} className="transition group-hover:translate-x-2" />
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* Grid */}
            {rest.length > 0 && (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((s, i) => (
                  <Reveal key={s.id} delay={(i % 3) * 120}>
                    <Link
                      href={`/stories/${s.slug}`}
                      className="group block h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <FoundationImage
                          src={usable(s.cover_image) ? s.cover_image : null}
                          alt={s.title}
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-regal-navy/50 via-transparent to-transparent" />
                      </div>
                      <div className="p-6">
                        <TagPills tags={s.tags} />
                        <h3 className="mt-3 text-lg font-bold text-regal-navy transition group-hover:text-regal-forest">
                          {s.title}
                        </h3>
                        {s.excerpt && (
                          <p className="mt-2 line-clamp-3 text-sm text-regal-earth">{s.excerpt}</p>
                        )}
                        <div className="mt-4">
                          <Meta s={s} />
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-regal-forest">
                          Read more{" "}
                          <ArrowRight size={14} className="transition group-hover:translate-x-2" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Ethical storytelling note */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <Reveal>
          <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-regal-navy to-regal-sky p-8 text-white shadow-xl md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <h2 className="font-display text-2xl font-bold">Stories told with dignity</h2>
              <p className="mt-2 max-w-2xl text-white/85">
                We share stories to show empowerment and genuine connection, never to exploit. Photos
                and details are published with care and in line with NDPR data protection standards.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="animate-float flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Camera size={26} />
              </div>
              <div
                className="animate-float flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"
                style={{ animationDelay: "1s" }}
              >
                <ShieldCheck size={26} />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden py-24 text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage src={IMG.cta} alt="Volunteers and children together" sizes="100vw" className="animate-kenburns" />
          <div className="absolute inset-0 bg-regal-navy/80" />
        </div>
        <Reveal className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-5xl">Help write the next story</h2>
          <p className="mt-3 text-white/85">
            Every gift, volunteer shift and village nomination becomes a story of care delivered.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved/donate" className="btn-primary animate-pulse-ring">
              <Heart size={18} /> Donate Now
            </Link>
            <Link href="/get-involved/volunteer" className="btn-outline-light">
              Volunteer
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}