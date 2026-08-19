import { cp, mkdir, readFile, readdir, rm, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const dist = path.join(root, "dist");
const src = path.join(root, "src");
const publicAssets = path.join(root, "public", "assets");
const distAssets = path.join(dist, "assets");

await rm(dist, { recursive: true, force: true });
await mkdir(distAssets, { recursive: true });

const convert = async (sourceName, outputName, options = {}) => {
  const source = path.join(publicAssets, sourceName);
  try {
    await access(source);
  } catch {
    throw new Error(`Asset ausente: ${sourceName}. Rode npm run assets antes do build.`);
  }
  let image = sharp(source);
  if (options.trim) image = image.trim({ background: { r: 248, g: 246, b: 240, alpha: 0 } });
  if (options.rotate) image = image.rotate(options.rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  await image.webp({ quality: options.quality ?? 90, effort: 5, smartSubsample: true }).toFile(path.join(distAssets, outputName));
};

await Promise.all([
  convert("figma_image3.png", "hero_background.webp", { quality: 86 }),
  convert("figma_image214.png", "hero_ghost.webp", { quality: 84 }),
  convert("figma_hero_person.png", "hero_person.webp", { quality: 92 }),
  convert("figma_online_person.png", "card_online_person.webp", { quality: 92 }),
  convert("figma_live_person.png", "card_live_person.webp", { quality: 92 }),
  convert("figma_podio_person.png", "card_podio_person.webp", { quality: 92 }),
  convert("figma_podio_detail_top.png", "podio_detail_top.webp", { quality: 88 }),
  convert("figma_podio_detail_bottom.png", "podio_detail_bottom.webp", { quality: 88 }),
  convert("figma_beginner_person.png", "card_beginner_person.webp", { quality: 92 }),
  convert("figma_speaker_person.png", "card_speaker_person.webp", { quality: 92 }),
  convert("figma_studio_eye.png", "card_studio_eye.webp", { quality: 92 }),
  convert("figma_about_person.png", "about_person.webp", { quality: 92 }),
]);

const [template, css, js, config] = await Promise.all([
  readFile(path.join(src, "index.html"), "utf8"),
  readFile(path.join(src, "styles.css"), "utf8"),
  readFile(path.join(src, "app.js"), "utf8"),
  readFile(path.join(src, "config.js"), "utf8"),
]);

const configObject = config
  .replace(/export\s+const\s+links\s*=\s*/, "const links = ")
  .replace(/;?\s*$/, ";");

const bundledJs = `${configObject}\n${js.replace(/^import\s+\{\s*links\s*\}\s+from\s+["']\.\/config\.js["'];?\s*/m, "")}`;
const bundled = template
  .replace("/*__INLINE_CSS__*/", css)
  .replace("/*__INLINE_JS__*/", bundledJs);

await writeFile(path.join(dist, "index.html"), bundled, "utf8");
await writeFile(path.join(dist, "styles.css"), css, "utf8");
await writeFile(path.join(dist, "app.js"), js, "utf8");
await writeFile(path.join(dist, "config.js"), config, "utf8");

const files = await readdir(dist, { recursive: true });
console.log(`Build concluído com ${files.length} itens em dist/. Layout reconstruído com assets WebP individuais do Figma.`);
