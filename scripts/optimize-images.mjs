/**
 * One-off asset pipeline for the Salon 5014 demo images.
 * Resizes + compresses the photos downloaded from salon5014.com
 * (their own photography, reused for this concept redesign).
 *
 * Run:  node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const dir = join(here, "..", "public", "images", "salon");
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

for (const f of files) {
  const isTeam = f.startsWith("team-");
  const width = isTeam ? 900 : 2000;
  const src = join(dir, f);
  const tmp = join(dir, `.${f}.opt.jpg`);
  try {
    const img = sharp(src, { failOn: "none" });
    const meta = await img.metadata();
    if (!meta.width || meta.width <= width) {
      // already small: keep as-is but ensure a .jpg exists if it was png/webp
      if (/\.(png|webp)$/i.test(f)) {
        await img.jpeg({ quality: 82 }).toFile(join(dir, f.replace(/\.(png|webp)$/i, ".jpg")));
      }
      continue;
    }
    await sharp(src, { failOn: "none" })
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: isTeam ? 78 : 80, mozjpeg: true, progressive: true })
      .toFile(tmp);
    const outName = f.replace(/\.(jpe?g|png|webp)$/i, ".jpg");
    renameSync(tmp, join(dir, outName));
    if (outName.toLowerCase() !== f.toLowerCase()) rmSync(src);
  } catch (e) {
    console.error("skip", f, e.message);
    if (join(dir, `.${f}.opt.jpg`) !== src) {
      try { rmSync(tmp); } catch { /* noop */ }
    }
  }
}

const after = readdirSync(dir);
const total = after.reduce((n, f) => n + (f.startsWith(".") ? 0 : 1), 0);
console.log(`optimized ${total} files in public/images/salon`);
