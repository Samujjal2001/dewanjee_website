import fs from "fs";
import path from "path";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const publicDir = path.join(projectRoot, "public");

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const TARGETS = [
  { dir: path.join(publicDir, "carousel"), maxWidth: 1920, quality: 78 },
  { dir: path.join(publicDir, "services"), maxWidth: 960, quality: 78 },
  { dir: path.join(publicDir, "gallery"), maxWidth: 1600, quality: 76 },
  // Optimize custom brand logos used in the Our Brands section
  { dir: path.join(publicDir, "our_brands"), maxWidth: 600, quality: 78 },
];

/**
 * Convert an input image to WebP, resizing to the given max width while preserving aspect ratio.
 * Writes next to the original with .webp extension and returns the new path.
 */
async function convertToWebp(inputPath, maxWidth, quality) {
  const ext = path.extname(inputPath);
  const outPath = inputPath.replace(new RegExp(ext + "$", "i"), ".webp");

  try {
    const image = sharp(inputPath, { limitInputPixels: false });
    const meta = await image.metadata();
    const width = meta.width || maxWidth;
    const resizeWidth = Math.min(width, maxWidth);

    await image
      .resize({ width: resizeWidth, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(outPath);

    return outPath;
  } catch (err) {
    console.error("Failed to convert", inputPath, err.message);
    return null;
  }
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, acc);
    else if (IMAGE_EXTS.has(path.extname(entry).toLowerCase())) acc.push(full);
  }
  return acc;
}

async function main() {
  const tasks = [];
  for (const { dir, maxWidth, quality } of TARGETS) {
    if (!fs.existsSync(dir)) continue;
    const files = walk(dir);
    for (const file of files) {
      // Skip if already a .webp and reasonably small
      if (file.endsWith(".webp")) continue;
      tasks.push(convertToWebp(file, maxWidth, quality));
    }
  }

  const results = await Promise.all(tasks);
  const created = results.filter(Boolean);
  console.log(`Created/updated ${created.length} WebP files.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


