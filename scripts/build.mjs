import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const dist = path.join(root, "dist");
const src = path.join(root, "src");
const publicAssets = path.join(root, "public", "assets");
const distAssets = path.join(dist, "assets");

await rm(dist, { recursive: true, force: true });
await mkdir(distAssets, { recursive: true });

const scaleRect = async (file, designW, designH, x, y, w, h) => {
  const meta = await sharp(file).metadata();
  const sx = meta.width / designW;
  const sy = meta.height / designH;
  return {
    left: Math.max(0, Math.round(x * sx)),
    top: Math.max(0, Math.round(y * sy)),
    width: Math.max(1, Math.round(w * sx)),
    height: Math.max(1, Math.round(h * sy)),
  };
};

const cropWebp = async ({ source, output, designW, designH, x, y, w, h, quality = 88 }) => {
  const rect = await scaleRect(source, designW, designH, x, y, w, h);
  await sharp(source)
    .extract(rect)
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(output);
};

const hero = path.join(publicAssets, "hero.png");
const links = path.join(publicAssets, "links.png");
const about = path.join(publicAssets, "about.png");

await cropWebp({ source: hero, output: path.join(distAssets, "hero_visual.webp"), designW: 800, designH: 783, x: 0, y: 0, w: 800, h: 530, quality: 90 });

const cardX = 35.223;
const cardW = 694.448;
const cardH = 257.166;
const cardTops = [28, 304.38, 580.76, 857.14, 1133.52, 1409.90];

await Promise.all([
  cropWebp({ source: links, output: path.join(distAssets, "card_online_visual.webp"), designW: 801, designH: 1736, x: cardX, y: cardTops[0], w: 315, h: cardH }),
  cropWebp({ source: links, output: path.join(distAssets, "card_live_visual.webp"), designW: 801, designH: 1736, x: cardX + 405, y: cardTops[1], w: cardW - 405, h: cardH }),
  cropWebp({ source: links, output: path.join(distAssets, "card_podio_visual.webp"), designW: 801, designH: 1736, x: cardX, y: cardTops[2], w: 285, h: cardH }),
  cropWebp({ source: links, output: path.join(distAssets, "card_beginner_visual.webp"), designW: 801, designH: 1736, x: cardX + 410, y: cardTops[3], w: cardW - 410, h: cardH }),
  cropWebp({ source: links, output: path.join(distAssets, "card_speaker_visual.webp"), designW: 801, designH: 1736, x: cardX, y: cardTops[4], w: 285, h: cardH }),
  cropWebp({ source: links, output: path.join(distAssets, "card_studio_visual.webp"), designW: 801, designH: 1736, x: cardX + 395, y: cardTops[5], w: cardW - 395, h: cardH }),
]);

await cropWebp({ source: about, output: path.join(distAssets, "about_visual.webp"), designW: 800, designH: 1200, x: 0, y: 0, w: 800, h: 600, quality: 90 });

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
await cp(publicAssets, path.join(distAssets, "source"), { recursive: true });

const files = await readdir(dist, { recursive: true });
console.log(`Build concluído com ${files.length} itens em dist/. WebPs gerados e CSS/JS embutidos no index.`);
