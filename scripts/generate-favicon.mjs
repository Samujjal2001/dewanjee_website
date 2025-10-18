import fs from "fs";
import path from "path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const publicDir = path.join(projectRoot, "public");
const appDir = path.join(projectRoot, "app");

const sourcePng = path.join(publicDir, "dewanjee_logo.png");
const tempDir = path.join(projectRoot, ".tmp-favicon");

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function generatePngVariants() {
  await ensureDir(tempDir);

  const sizes = [16, 32, 48, 64, 128, 256];
  const outputs = [];
  for (const size of sizes) {
    const outPath = path.join(tempDir, `favicon-${size}.png`);
    await sharp(sourcePng)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    outputs.push(outPath);
  }

  // Also emit app/icon.png for Next.js (used by PWA or social)
  const iconPng = path.join(appDir, "icon.png");
  await sharp(sourcePng)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(iconPng);

  return outputs;
}

async function buildIco(pngPaths) {
  const icoBuffer = await pngToIco(pngPaths);
  const outIco = path.join(appDir, "favicon.ico");
  fs.writeFileSync(outIco, icoBuffer);
  return outIco;
}

async function cleanup() {
  if (!fs.existsSync(tempDir)) return;
  for (const f of fs.readdirSync(tempDir)) fs.unlinkSync(path.join(tempDir, f));
  fs.rmdirSync(tempDir);
}

async function main() {
  if (!fs.existsSync(sourcePng)) {
    console.error(`Source logo not found at ${sourcePng}`);
    process.exit(1);
  }

  await ensureDir(appDir);
  const variants = await generatePngVariants();
  const icoPath = await buildIco(variants);
  await cleanup();
  console.log(`Generated ${icoPath} and app/icon.png`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


