/**
 * Build-time glyph extractor.
 * Reads Ethiopic font files installed via @fontsource and extracts SVG
 * path data for glyphs needed by MorphSVGPlugin / DrawSVGPlugin.
 *
 * Run:    node scripts/extract-glyphs.mjs
 * Output: src/lib/data/glyphs.json
 *
 * Resolution order:
 *   1. @fontsource/abyssinica-sil  — woff (ethiopic subset)
 *   2. @fontsource/noto-sans-ethiopic — woff (any weight)
 *   3. System TTF at /usr/share/fonts/noto/NotoSansEthiopic-Regular.ttf
 */

import opentype from 'opentype.js';
const { parse } = opentype;
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'src/lib/data/glyphs.json');

// ሀ family — all 7 orders (ግዕዝ through ሳብዕ)
const TARGET_GLYPHS = ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ'];

// Canvas size in font units — glyphs rendered into a 1000×1000 viewBox
const SIZE = 1000;

/**
 * Find the first .woff, .ttf, or .otf file in a @fontsource package directory.
 * Prefers woff over woff2 (opentype.js parses woff but not woff2).
 */
function findFontFileInPackage(packageName) {
  let pkgDir;
  try {
    pkgDir = dirname(require.resolve(`${packageName}/package.json`));
  } catch {
    return null;
  }

  const filesDir = resolve(pkgDir, 'files');
  const searchDirs = existsSync(filesDir) ? [filesDir, pkgDir] : [pkgDir];

  for (const dir of searchDirs) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    // woff first — opentype.js handles woff but not woff2
    for (const ext of ['.woff', '.ttf', '.otf']) {
      const match = entries.find((e) => e.endsWith(ext));
      if (match) return resolve(dir, match);
    }
  }
  return null;
}

function loadFont(fontPath) {
  const buf = readFileSync(fontPath);
  // parse() accepts ArrayBuffer; Node Buffer has .buffer but offset matters — copy to be safe
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return parse(ab);
}

function extractGlyphs(font, chars, label) {
  const upem = font.unitsPerEm;

  // First pass: render each path and get its true SVG bounding box
  const pathData = {};
  for (const char of chars) {
    const glyph = font.charToGlyph(char);
    if (!glyph || glyph.index === 0) {
      console.warn(`  ⚠  no glyph for '${char}' in ${label}`);
      continue;
    }
    // Baseline at 80% of canvas — keeps ascenders inside the viewBox
    const path = glyph.getPath(0, SIZE * 0.8, SIZE);
    const d = path.toPathData(3);
    // getBoundingBox() on the rendered Path gives true SVG-space bounds
    const svgBBox = path.getBoundingBox();
    pathData[char] = { d, svgBBox };
    console.log(
      `  ✓  '${char}'  (glyph ${glyph.index}) ` +
      `bbox=(${svgBBox.x1.toFixed(0)},${svgBBox.y1.toFixed(0)})–(${svgBBox.x2.toFixed(0)},${svgBBox.y2.toFixed(0)})`
    );
  }

  if (Object.keys(pathData).length === 0) return {};

  // Compute a single shared viewBox that fits ALL glyphs — required for
  // MorphSVGPlugin consistency (morphing changes path data, not the viewBox).
  const bboxes = Object.values(pathData).map((p) => p.svgBBox);
  const PAD = 24;
  const vx = Math.floor(Math.min(...bboxes.map((b) => b.x1)) - PAD);
  const vy = Math.floor(Math.min(...bboxes.map((b) => b.y1)) - PAD);
  const vx2 = Math.ceil(Math.max(...bboxes.map((b) => b.x2)) + PAD);
  const vy2 = Math.ceil(Math.max(...bboxes.map((b) => b.y2)) + PAD);
  const sharedViewBox = `${vx} ${vy} ${vx2 - vx} ${vy2 - vy}`;
  console.log(`\n  shared viewBox: "${sharedViewBox}"`);

  const out = {};
  for (const char of chars) {
    if (!pathData[char]) continue;
    const { d, svgBBox } = pathData[char];
    out[char] = {
      char,
      d,
      font: label,
      upem,
      viewBox: sharedViewBox,
      bbox: { x1: svgBBox.x1, y1: svgBBox.y1, x2: svgBBox.x2, y2: svgBBox.y2 },
    };
  }
  return out;
}

async function main() {
  const candidates = [
    {
      label: 'Abyssinica SIL',
      path: findFontFileInPackage('@fontsource/abyssinica-sil'),
    },
    {
      label: 'Noto Sans Ethiopic (@fontsource)',
      path: findFontFileInPackage('@fontsource/noto-sans-ethiopic'),
    },
    {
      label: 'Noto Sans Ethiopic (system)',
      path: existsSync('/usr/share/fonts/noto/NotoSansEthiopic-Regular.ttf')
        ? '/usr/share/fonts/noto/NotoSansEthiopic-Regular.ttf'
        : null,
    },
  ];

  let glyphs = {};

  for (const { label, path } of candidates) {
    if (!path) {
      console.log(`  —  ${label}: not found, skipping`);
      continue;
    }

    console.log(`\nLoading ${label}`);
    console.log(`  ${path}`);

    try {
      const font = loadFont(path);
      glyphs = extractGlyphs(font, TARGET_GLYPHS, label);
    } catch (err) {
      console.warn(`  ✗  failed to parse: ${err.message}`);
      continue;
    }

    if (Object.keys(glyphs).length > 0) break;
  }

  if (Object.keys(glyphs).length === 0) {
    console.error('\n✗ No glyphs extracted. Verify font packages are installed.');
    process.exit(1);
  }

  const output = {
    _note: 'Generated by scripts/extract-glyphs.mjs — do not edit by hand',
    glyphs,
  };

  writeFileSync(OUT, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n✓ ${Object.keys(glyphs).length} glyphs → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
