// Usage (from the frontend/ folder):
//   node scripts/fill-images.mjs path/to/any-photo.jpg
// Copies ONE photo into every image name the Home, About, Programs, Missions and Stories pages expect,
// skipping any file that already exists. Use it to see the full layout
// immediately, then replace each file with a real photo.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const src = process.argv[2];
if (!src || !existsSync(src)) {
  console.error("Give the path to an existing photo: node scripts/fill-images.mjs my-photo.jpg");
  process.exit(1);
}

const names = [
  "hero-outreach", "hero-doctor", "hero-children", "hero-feeding",
  "pillar-healthcare", "pillar-feeding", "pillar-education", "pillar-maternal",
  "mission-bg", "cta-bg",
  ...Array.from({ length: 8 }, (_, i) => `gallery-${i + 1}`),
  "about-hero", "about-story-1", "about-story-2", "about-clinic", "about-process", "about-cta",
  ...Array.from({ length: 6 }, (_, i) => `about-${i + 1}`),
  "programs-hero", "programs-cta",
  "missions-hero", "missions-cta",
  "stories-hero", "stories-cta",
  "program-healthcare", "program-feeding", "program-education", "program-maternal",
];

const dir = join("public", "images");
mkdirSync(dir, { recursive: true });
let made = 0;
for (const n of names) {
  const dest = join(dir, `${n}.jpg`);
  if (!existsSync(dest)) {
    copyFileSync(src, dest);
    made++;
  }
}
console.log(`Created ${made} placeholder copies in ${dir}`);
