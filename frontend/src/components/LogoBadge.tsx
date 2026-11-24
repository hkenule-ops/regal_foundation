import Image from "next/image";

/**
 * Crops the whitespace out of /public/images/logo.png so only the emblem
 * and name show. Replace logo.png with a transparent PNG/SVG later and
 * simply remove the scale/origin classes.
 */
export default function LogoBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-regal-cream shadow-2xl ring-4 ring-white/30 ${className}`}
    >
      <Image
        src="/images/logo.png"
        alt="Regal Health and Humanity Foundation logo"
        fill
        sizes="320px"
        className="origin-[50%_11%] scale-[1.3] object-cover"
      />
    </div>
  );
}