import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const dir = path.join(root, "public", "assets");
await mkdir(dir, { recursive: true });

const rasters = [
  ["fx_image3.webp", "https://www.figma.com/api/mcp/asset/5c4206f3-7766-4ee7-a2a1-72e107bb99dd.png", 82],
  ["fx_image214.webp", "https://www.figma.com/api/mcp/asset/abbf8722-01f3-4fa4-8497-32f9de90990b.png", 82],
  ["fx_camada14.webp", "https://www.figma.com/api/mcp/asset/107fe6ae-933d-4aea-80d1-823b53339302.png", 80],
  ["fx_hero_person.webp", "https://www.figma.com/api/mcp/asset/05e94ec6-1abb-4327-b15f-d76e0d9c9a51.png", 90],
  ["fx_image215.webp", "https://www.figma.com/api/mcp/asset/e54ea377-f659-4651-8029-1b640ef25f48.png", 76],
  ["fx_live_person.webp", "https://www.figma.com/api/mcp/asset/1f60dc50-c2c7-4b70-b95d-0cf3e1f53f03.png", 90],
  ["fx_texture.webp", "https://www.figma.com/api/mcp/asset/31040642-1011-4904-b04a-540e8e18a5ef.png", 80],
  ["fx_podio_top.webp", "https://www.figma.com/api/mcp/asset/cdc40ef6-a5fb-4101-8792-906b38f3b1bf.png", 88],
  ["fx_podio_bottom.webp", "https://www.figma.com/api/mcp/asset/1b5251ca-bf74-4e7c-aed9-ee62f7940cbf.png", 88],
  ["fx_podio_person.webp", "https://www.figma.com/api/mcp/asset/bdcb84c8-e4f7-4f2e-85c6-3f5482df3212.png", 90],
  ["fx_beginner_person.webp", "https://www.figma.com/api/mcp/asset/83ec45d6-6a30-478f-9d8e-1e04d855979d.png", 90],
  ["fx_speaker_person.webp", "https://www.figma.com/api/mcp/asset/7b16832c-dd6d-47d2-86dd-ae93bf3bde5b.png", 90],
  ["fx_studio_eye.webp", "https://www.figma.com/api/mcp/asset/cdcf3d5b-97cf-4cde-b25c-49d736d0141e.png", 88],
  ["fx_medal_bg.webp", "https://www.figma.com/api/mcp/asset/76b7ba18-cce8-4242-ae94-200e24ae75e9.png", 80],
  ["fx_online_person.webp", "https://www.figma.com/api/mcp/asset/b5ed1e6d-fdae-40d5-a879-f446ada44e13.png", 90],
  ["fx_about_person.webp", "https://www.figma.com/api/mcp/asset/1b07da61-22e8-4835-b3e7-0d30be5613c0.png", 90]
];

const svgs = [
  ["ellipse138.svg", "https://www.figma.com/api/mcp/asset/a35a4c15-676f-4ecc-8b11-4fe9b3c6f521.svg"],
  ["ellipse139.svg", "https://www.figma.com/api/mcp/asset/7b9dff7f-8176-403c-b242-de3aa3889d45.svg"],
  ["ellipse140.svg", "https://www.figma.com/api/mcp/asset/719dfec6-5ada-49cc-8ea9-316a59b8b6af.svg"],
  ["ellipse137.svg", "https://www.figma.com/api/mcp/asset/c9545c7e-70d6-4e4e-96a8-2c15f4753e74.svg"],
  ["ellipse141.svg", "https://www.figma.com/api/mcp/asset/6d2e17bc-3be3-441f-b7c0-cda5b49d169b.svg"],
  ["ellipse136.svg", "https://www.figma.com/api/mcp/asset/7ff0bfdc-6dc1-4c3d-858f-537c47c2e999.svg"],
  ["ellipse9.svg", "https://www.figma.com/api/mcp/asset/ce60277d-5bae-4874-a690-5e22c7ec81c2.svg"],
  ["ellipse10.svg", "https://www.figma.com/api/mcp/asset/0df72f7e-e21e-438b-bbff-f4b52777b836.svg"],
  ["ellipse11.svg", "https://www.figma.com/api/mcp/asset/a1ec65bd-0bcf-4311-99ee-cb2eaa089de9.svg"],
  ["ellipse12.svg", "https://www.figma.com/api/mcp/asset/3298fbbf-9ab3-4e4a-8b1e-ab96cd317754.svg"],
  ["ellipse135.svg", "https://www.figma.com/api/mcp/asset/7d73617b-14e5-4415-b1e4-3ba232b16d0f.svg"]
];

for (const [name, url, quality] of rasters) {
  const target = path.join(dir, name);
  try {
    await access(target);
    console.log(`Mantido: ${name}`);
    continue;
  } catch {}
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao baixar ${name}: ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  await sharp(input)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(target);
  console.log(`Gerado: ${name}`);
}

for (const [name, url] of svgs) {
  const target = path.join(dir, name);
  try {
    await access(target);
    console.log(`Mantido: ${name}`);
    continue;
  } catch {}
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao baixar ${name}: ${response.status}`);
  await writeFile(target, await response.text(), "utf8");
  console.log(`Gerado: ${name}`);
}
