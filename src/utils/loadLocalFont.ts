import fs from "node:fs";
import path from "node:path";

/**
 * Load local Inter font files for satori OG image generation.
 * Fonts are placed in public/fonts/ which is copied to dist/ at build time.
 * Uses process.cwd() for reliable path resolution in both dev and build.
 */

function resolveFontPath(weight: number): string {
  // Try multiple locations for compatibility with dev and build modes
  const fileName = `inter-${weight}-normal.ttf`;
  const candidates = [
    path.join(process.cwd(), "public", "fonts", fileName),
    path.join(process.cwd(), "dist", "fonts", fileName),
  ];
  for (const fp of candidates) {
    if (fs.existsSync(fp)) return fp;
  }
  // Fallback to the first candidate
  return candidates[0];
}

async function loadLocalFont(
  weight: number
): Promise<ArrayBuffer> {
  const filePath = resolveFontPath(weight);
  const buffer = fs.readFileSync(filePath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}

async function loadLocalFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    { name: "Inter", weight: 400, style: "normal" },
    { name: "Inter", weight: 700, style: "bold" },
  ];

  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, weight, style }) => {
      const data = await loadLocalFont(weight);
      return { name, data, weight, style };
    })
  );

  return fonts;
}

export default loadLocalFonts;
