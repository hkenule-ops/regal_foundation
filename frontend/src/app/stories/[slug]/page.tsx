import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Heart, MapPin } from "lucide-react";
import { api, type Mission, type Story } from "@/lib/api";
import { usable, formatDate, readingMinutes } from "@/lib/media";
import Reveal from "@/components/Reveal";
import FoundationImage from "@/components/FoundationImage";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const s = await api.getStory(slug);
    return {
      title: s.title,
      description: s.excerpt,
      openGraph: {
        title: s.title,
        description: s.excerpt,
        images: usable(s.cover_image) ? [s.cover_image] : undefined,
      },
    };
  } catch {
    return { title: "Story" };
  }
}

/**
 * Plain-text content from the admin becomes tidy typography:
 *   blank line = new paragraph, "## " = subheading, "> " = pull quote.
 */
function Content({ text }: { text: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-12 font-display text-2xl font-bold text-regal-navy md:text-3xl">
              {b.slice(3)}
            </h2>
          );
        }
        if (b.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="my-8 rounded-2xl border-l-4 border-regal-gold bg-white p-6 font-display text-xl italic text-regal-navy shadow-sm"
            >
              {b.replace(/^> ?/gm, "")}
            </blockquote>
          );
        }
        return (
          <p
            key={i}
            className={`mt-5 whitespace-pre-line leading-relaxed text-regal-charcoal ${
              i === 0 ? "text-xl first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.9] first-letter:text-regal-forest" : "text-lg"
            }`}
          >
            {b}
          </p>
        );
      })}
    </>
  );
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;
  let story: Story;
  try {
    story = await api.getStory(slug);
  } catch {
    notFound();
  }

  const [mission, others] = await Promise.all([
    story.mission_id
      ? api.getMission(story.mission_id).catch(() => null as Mission | null)
      : Promise.resolve(null as Mission | null),
    api.getStories("limit=20").catch(() => [] as Story[]),
  ]);

  const more = (others || []).filter((s) => s.id !== story.id).slice(0, 3);
  const cover = usable(story.cover_image) ? story.cover_image : null;

  return (
    <>
      <ReadingProgress />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-regal-navy text-white">
        <div className="absolute inset-0 -z-10">
          <FoundationImage
            src={cover}
            alt={story.title}
            priority
            sizes="100vw"
            className="animate-kenburns opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-regal-navy via-regal-navy/80 to-regal-navy/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-regal-gold/30 via-transparent to-transparent" />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
          <Link
            href="/stories"
            className="animate-fade-up group inline-flex items-center gap-2 text-sm font-medium text-regal-gold-light"
          >
            <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /> All Stories
          </Link>
          {story.tags.length > 0 && (
            <div className="animate-fade-up mt-5 flex flex-wrap gap-2" style={{ animationDelay: "100ms" }}>
              {story.tags.map((t) => (
                <Link
                  key={t}
                  href={`/stories?tag=${encodeURIComponent(t)}`}
                  className="rounded-full bg-regal-gold px-3 py-1 text-xs font-bold text-regal-navy transition hover:bg-regal-gold-light"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}
          <h1
            className="animate-fade-up mt-4 font-display text-4xl font-bold leading-tight md:text-5xl"
            style={{ animationDelay: "200ms" }}
          >
            {story.title}
          </h1>
          <div
            className="animate-fade-up mt-5 flex flex-wrap gap-5 text-sm text-white/75"
            style={{ animationDelay: "350ms" }}
          >
            <span className="inline-flex items-center gap-2">
              <Calendar size={16} className="text-regal-gold-light" /> {formatDate(story.created_at)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-regal-gold-light" /> {readingMinutes(story.content)} min read
            </span>
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        {story.excerpt && (
          <Reveal>
            <p className="rounded-2xl bg-regal-gold/15 p-5 text-lg font-medium leading-relaxed text-regal-navy">
              {story.excerpt}
            </p>
          </Reveal>
        )}

        <div className="mt-6">
          <Content text={story.content} />
        </div>

        <Reveal className="mt-12 border-t border-gray-200 pt-6">
          <ShareButtons title={story.title} />
        </Reveal>

        {/* Related mission */}
        {mission && (
          <Reveal className="mt-12">
            <Link
              href={`/missions/${mission.id}`}
              className="group grid overflow-hidden rounded-2xl bg-regal-navy text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[180px_1fr]"
            >
              <div className="relative h-40 overflow-hidden sm:h-auto">
                <FoundationImage
                  src={usable(mission.cover_image) ? mission.cover_image : null}
                  alt={mission.title}
                  sizes="180px"
                  className="transition duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-regal-gold-light">
                  From this mission
                </p>
                <h3 className="mt-1 text-lg font-bold">{mission.title}</h3>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/70">
                  <MapPin size={14} /> {mission.target_lga ? `${mission.target_lga}, ` : ""}
                  {mission.target_state}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-regal-gold-light">
                  View the mission report{" "}
                  <ArrowRight size={14} className="transition group-hover:translate-x-2" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}
      </article>

      {/* More stories */}
      {more.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <Reveal className="mb-8 text-center">
              <h2 className="section-heading">More from the field</h2>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {more.map((s, i) => (
                <Reveal key={s.id} delay={i * 120}>
                  <Link
                    href={`/stories/${s.slug}`}
                    className="group block h-full overflow-hidden rounded-2xl bg-regal-cream shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <FoundationImage
                        src={usable(s.cover_image) ? s.cover_image : null}
                        alt={s.title}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="transition duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-regal-navy transition group-hover:text-regal-forest">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-xs text-regal-earth">
                        {formatDate(s.created_at, { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                        {readingMinutes(s.content)} min read
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-regal-navy py-20 text-white">
        <Reveal className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Stories like this need your help
          </h2>
          <p className="mt-3 text-white/80">
            Your support brings care, meals and school supplies to the next village.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved/donate" className="btn-primary animate-pulse-ring">
              <Heart size={18} /> Donate Now
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