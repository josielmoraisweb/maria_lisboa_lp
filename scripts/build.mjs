import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const src = path.join(root, "src");
const assets = path.join(root, "public", "assets");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of ["index.html", "styles.css", "app.js", "config.js"]) {
  await cp(path.join(src, file), path.join(dist, file));
}

await cp(assets, path.join(dist, "assets"), { recursive: true });

const files = await readdir(dist, { recursive: true });
console.log(`Build concluído com ${files.length} itens em dist/.`);
