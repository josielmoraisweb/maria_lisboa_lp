import { mkdir, access, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const assets = {
  "hero.png": "https://www.figma.com/api/mcp/asset/e81beb28-193b-4bef-981d-71e614932766.png",
  "links.png": "https://www.figma.com/api/mcp/asset/a1974fc2-baf2-4484-99f8-b0a565c5c939.png",
  "about.png": "https://www.figma.com/api/mcp/asset/9b026c0d-eaab-42ed-a0e6-44e9db16d514.png",
  "footer.png": "https://www.figma.com/api/mcp/asset/624fd4e7-9191-4a21-b89a-fe4a26e3f8aa.png"
};

const outputDir = path.resolve("public/assets");
await mkdir(outputDir, { recursive: true });

async function exists(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

for (const [filename, url] of Object.entries(assets)) {
  const destination = path.join(outputDir, filename);
  if (await exists(destination)) {
    console.log(`Asset já existe: ${filename}`);
    continue;
  }

  console.log(`Baixando ${filename}...`);
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0" },
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`Falha ao baixar ${filename}: HTTP ${response.status}`);
  }

  const data = Buffer.from(await response.arrayBuffer());
  if (data.length < 1000) {
    throw new Error(`Asset ${filename} parece inválido, apenas ${data.length} bytes.`);
  }

  await writeFile(destination, data);
  console.log(`Salvo: ${destination}`);
}
