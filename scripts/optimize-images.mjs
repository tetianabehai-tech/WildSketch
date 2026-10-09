import fs from "node:fs/promises";
import sharp from "sharp";
let html = await fs.readFile("index.html", "utf8");
const files = (await fs.readdir("public/images")).filter((name) =>
  name.endsWith(".png"),
);
for (const name of files) {
  const input = `public/images/${name}`;
  const base = name.slice(0, -4);
  const metadata = await sharp(input).metadata();
  for (const width of [400, 800, 1400]) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(`public/images/${base}-${width}.webp`);
  }
  const pattern = new RegExp(
    `src="\\./images/${name.replace(".", "\\.")}"`,
    "g",
  );
  html = html.replace(
    pattern,
    `src="./images/${base}-800.webp" srcset="./images/${base}-400.webp ${Math.min(400, metadata.width)}w, ./images/${base}-800.webp ${Math.min(800, metadata.width)}w, ./images/${base}-1400.webp ${Math.min(1400, metadata.width)}w" sizes="(min-width: 1440px) 640px, (min-width: 768px) 600px, calc(100vw - 32px)" width="${metadata.width}" height="${metadata.height}"`,
  );
  await fs.rename(input, `assets/originals/${name}`);
}
await fs.writeFile("index.html", html);
console.log(
  `Optimized ${files.length} images; original files preserved in assets/originals.`,
);
