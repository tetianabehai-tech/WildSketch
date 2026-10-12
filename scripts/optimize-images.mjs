import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
const [source, name] = process.argv.slice(2);
if (!source || !/^[a-z0-9-]+$/.test(name || ""))
  throw Error(
    "Usage: node scripts/optimize-images.mjs <original-image> <asset-name>",
  );
const metadata = await sharp(source).metadata();
await fs.mkdir("src/img", { recursive: true });
for (const width of [400, 800, 1400, 1600, 1800].filter(
  (width) => width <= metadata.width,
)) {
  await sharp(source)
    .resize({ width })
    .webp({ quality: 88 })
    .toFile(path.join("src/img", `${name}-${width}.webp`));
}
console.log("Responsive WebP files saved in src/img; original preserved.");
