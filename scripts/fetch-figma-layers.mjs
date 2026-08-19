import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "public", "assets");
await mkdir(dir, { recursive: true });

const assets = {
  "figma_image3.png": "https://www.figma.com/api/mcp/asset/efc23c36-99fb-431c-9e7f-dfbf83e1cac2.png",
  "figma_image214.png": "https://www.figma.com/api/mcp/asset/d16cd21e-7e05-47da-99ce-63929af8e6d1.png",
  "figma_hero_person.png": "https://www.figma.com/api/mcp/asset/4e39e2cc-0b23-48a3-bcd3-8ea044830aa9.png",
  "figma_online_person.png": "https://www.figma.com/api/mcp/asset/ff5ca2a4-1a9c-4165-becc-5dff4943efb5.png",
  "figma_live_person.png": "https://www.figma.com/api/mcp/asset/65eeaa2a-e314-41c9-a9eb-9b76605eb965.png",
  "figma_podio_person.png": "https://www.figma.com/api/mcp/asset/edd1d95f-63f4-460d-b1fa-884b8c574262.png",
  "figma_podio_detail_top.png": "https://www.figma.com/api/mcp/asset/1671d1a5-df68-4116-8a2f-beeb104a836b.png",
  "figma_podio_detail_bottom.png": "https://www.figma.com/api/mcp/asset/de95e1ac-f165-4eff-8d1d-90113c5711a2.png",
  "figma_beginner_person.png": "https://www.figma.com/api/mcp/asset/971f38c9-43ac-44d9-b69d-35c384129795.png",
  "figma_speaker_person.png": "https://www.figma.com/api/mcp/asset/9a883cb0-8807-4a02-8a19-079c5331ac43.png",
  "figma_studio_eye.png": "https://www.figma.com/api/mcp/asset/590edc91-e173-41af-a0bc-64596d38466a.png",
  "figma_about_person.png": "https://www.figma.com/api/mcp/asset/fd57df54-36a8-4d43-af87-ea4d362183f9.png"
};

for (const [name, url] of Object.entries(assets)) {
  const target = path.join(dir, name);
  try {
    await access(target);
    console.log(`Mantido: ${name}`);
    continue;
  } catch {}

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao baixar ${name}: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(target, bytes);
  console.log(`Baixado: ${name}`);
}
