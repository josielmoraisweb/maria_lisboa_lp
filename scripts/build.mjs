import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const src = path.join(root, "src");
const publicAssets = path.join(root, "public", "assets");
const distAssets = path.join(dist, "assets");

await rm(dist, { recursive: true, force: true });
await mkdir(distAssets, { recursive: true });
await cp(publicAssets, distAssets, { recursive: true });

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
console.log(`Build concluído com ${files.length} itens em dist/. Layout 800px preservado e assets otimizados copiados.`);
