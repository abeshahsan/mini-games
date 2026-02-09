/**
 * Memory Match Game – Asset Generator
 * ====================================
 * Generates all image assets from SVG sources using sharp.
 * Run: node scripts/generate-assets.mjs
 */

import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SVG_DIR = path.join(__dirname, "assets", "svg");
const OUT_DIR = path.join(__dirname, "..", "public", "assets");

// Helpers
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readSvg(name) {
  return fs.readFile(path.join(SVG_DIR, name), "utf-8");
}

async function svgToPng(svgContent, width, height, outPath, opts = {}) {
  const dir = path.dirname(outPath);
  await ensureDir(dir);
  let pipeline = sharp(Buffer.from(svgContent)).resize(width, height, {
    fit: "contain",
    background: opts.background || { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (opts.flatten) {
    pipeline = pipeline.flatten({ background: opts.flatten });
  }
  await pipeline.png().toFile(outPath);
  console.log(`  ✓ ${path.relative(OUT_DIR, outPath)} (${width}x${height})`);
}

async function svgToWebp(svgContent, width, height, outPath) {
  const dir = path.dirname(outPath);
  await ensureDir(dir);
  await sharp(Buffer.from(svgContent))
    .resize(width, height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 90 })
    .toFile(outPath);
  console.log(`  ✓ ${path.relative(OUT_DIR, outPath)} (${width}x${height} webp)`);
}

async function copySvg(svgName, outPath) {
  const dir = path.dirname(outPath);
  await ensureDir(dir);
  await fs.copyFile(path.join(SVG_DIR, svgName), outPath);
  console.log(`  ✓ ${path.relative(OUT_DIR, outPath)} (svg copy)`);
}

/**
 * Create a multi-size ICO from an SVG.
 * Creates a simple ICO by embedding PNG data for multiple sizes.
 */
async function createIco(svgContent, sizes, outPath) {
  const dir = path.dirname(outPath);
  await ensureDir(dir);

  const pngBuffers = [];
  for (const size of sizes) {
    const buf = await sharp(Buffer.from(svgContent))
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
    pngBuffers.push({ size, data: buf });
  }

  // Build ICO file format
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * numImages;

  let dataOffset = headerSize + dirSize;
  const entries = [];
  for (const { size, data } of pngBuffers) {
    entries.push({
      width: size >= 256 ? 0 : size,
      height: size >= 256 ? 0 : size,
      dataSize: data.length,
      dataOffset,
      data,
    });
    dataOffset += data.length;
  }

  const totalSize = dataOffset;
  const ico = Buffer.alloc(totalSize);

  // ICO header
  ico.writeUInt16LE(0, 0); // reserved
  ico.writeUInt16LE(1, 2); // type: ICO
  ico.writeUInt16LE(numImages, 4);

  // Directory entries
  let offset = headerSize;
  for (const entry of entries) {
    ico.writeUInt8(entry.width, offset);
    ico.writeUInt8(entry.height, offset + 1);
    ico.writeUInt8(0, offset + 2); // color palette
    ico.writeUInt8(0, offset + 3); // reserved
    ico.writeUInt16LE(1, offset + 4); // color planes
    ico.writeUInt16LE(32, offset + 6); // bits per pixel
    ico.writeUInt32LE(entry.dataSize, offset + 8);
    ico.writeUInt32LE(entry.dataOffset, offset + 12);
    offset += dirEntrySize;
  }

  // Image data
  for (const entry of entries) {
    entry.data.copy(ico, entry.dataOffset);
  }

  await fs.writeFile(outPath, ico);
  console.log(`  ✓ ${path.relative(OUT_DIR, outPath)} (ico: ${sizes.join(",")}px)`);
}

/**
 * Generate a programmatic SVG for card symbols
 */
function makeCardSvg(emoji, bgColor1, bgColor2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor1};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${bgColor2};stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="200" height="280" rx="20" fill="white"/>
  <rect x="6" y="6" width="188" height="268" rx="16" fill="none" stroke="#f0f0f0" stroke-width="1.5"/>
  <text x="100" y="160" font-family="Arial,sans-serif" font-size="80" text-anchor="middle">${emoji}</text>
</svg>`;
}

/**
 * Generate a UI icon SVG
 */
function makeUiIconSvg(type) {
  const icons = {
    play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#6C5CE7"/>
      <polygon points="24,16 24,48 50,32" fill="white"/>
    </svg>`,
    pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#6C5CE7"/>
      <rect x="20" y="18" width="8" height="28" rx="2" fill="white"/>
      <rect x="36" y="18" width="8" height="28" rx="2" fill="white"/>
    </svg>`,
    restart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#6C5CE7"/>
      <path d="M32 14a18 18 0 0 1 18 18h-6a12 12 0 0 0-12-12V14z" fill="white"/>
      <polygon points="32,10 32,24 22,17" fill="white"/>
      <path d="M32 50a18 18 0 0 1-18-18h6a12 12 0 0 0 12 12v6z" fill="white"/>
      <polygon points="32,54 32,40 42,47" fill="white"/>
    </svg>`,
    sound_on: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#6C5CE7"/>
      <polygon points="18,24 26,24 36,14 36,50 26,40 18,40" fill="white"/>
      <path d="M42 22c3 3 5 7 5 10s-2 7-5 10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <path d="M46 16c5 5 8 11 8 16s-3 11-8 16" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    sound_off: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#6C5CE7"/>
      <polygon points="18,24 26,24 36,14 36,50 26,40 18,40" fill="white"/>
      <line x1="42" y1="24" x2="54" y2="42" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <line x1="54" y1="24" x2="42" y2="42" stroke="white" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#6C5CE7"/>
      <path d="M32 16L14 32h6v14h8v-10h8v10h8V32h6L32 16z" fill="white"/>
    </svg>`,
    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="30" fill="#6C5CE7"/>
      <circle cx="32" cy="32" r="8" fill="none" stroke="white" stroke-width="3"/>
      <g stroke="white" stroke-width="3" stroke-linecap="round">
        <line x1="32" y1="12" x2="32" y2="18"/>
        <line x1="32" y1="46" x2="32" y2="52"/>
        <line x1="12" y1="32" x2="18" y2="32"/>
        <line x1="46" y1="32" x2="52" y2="32"/>
        <line x1="17.9" y1="17.9" x2="22.1" y2="22.1"/>
        <line x1="41.9" y1="41.9" x2="46.1" y2="46.1"/>
        <line x1="17.9" y1="46.1" x2="22.1" y2="41.9"/>
        <line x1="41.9" y1="22.1" x2="46.1" y2="17.9"/>
      </g>
    </svg>`,
  };
  return icons[type] || icons.play;
}

/**
 * Generate medal/achievement icon SVG
 */
function makeMedalSvg(color1, color2, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="medalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1"/>
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1"/>
      </linearGradient>
    </defs>
    <!-- Ribbon -->
    <polygon points="40,0 52,48 64,0" fill="${color1}" opacity="0.6"/>
    <polygon points="88,0 76,48 64,0" fill="${color2}" opacity="0.6"/>
    <!-- Medal circle -->
    <circle cx="64" cy="72" r="44" fill="url(#medalGrad)"/>
    <circle cx="64" cy="72" r="37" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <!-- Star -->
    <text x="64" y="84" font-family="Arial,sans-serif" font-size="36" fill="white" text-anchor="middle" font-weight="bold">${label}</text>
  </svg>`;
}

/**
 * Generate a game background tile SVG
 */
function makeGameBgSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1"/>
      </linearGradient>
      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="none" stroke="rgba(108,92,231,0.06)" stroke-width="1"/>
      </pattern>
      <pattern id="dots" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <circle cx="40" cy="40" r="1.5" fill="rgba(168,85,247,0.08)"/>
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#bgGrad)"/>
    <rect width="400" height="400" fill="url(#grid)"/>
    <rect width="400" height="400" fill="url(#dots)"/>
  </svg>`;
}

// ============================================================
//  MAIN GENERATION
// ============================================================

async function main() {
  console.log("\n🎴 Memory Match — Asset Generator\n" + "=".repeat(40));

  // ──────────────────────────────────
  //  1. FAVICONS & BROWSER ICONS
  // ──────────────────────────────────
  console.log("\n📌 1/7  Favicons & Browser Icons");
  const iconSvg = await readSvg("logo-icon.svg");

  await createIco(iconSvg, [16, 32, 48], path.join(OUT_DIR, "favicon.ico"));
  await svgToPng(iconSvg, 32, 32, path.join(OUT_DIR, "favicon.png"));
  await svgToPng(iconSvg, 180, 180, path.join(OUT_DIR, "apple-touch-icon.png"), {
    flatten: { r: 108, g: 92, b: 231 },
  });
  await svgToPng(iconSvg, 192, 192, path.join(OUT_DIR, "android-chrome-192x192.png"));
  await svgToPng(iconSvg, 512, 512, path.join(OUT_DIR, "android-chrome-512x512.png"));
  await svgToPng(iconSvg, 150, 150, path.join(OUT_DIR, "mstile-150x150.png"), {
    flatten: { r: 108, g: 92, b: 231 },
  });
  await copySvg("safari-pinned-tab.svg", path.join(OUT_DIR, "safari-pinned-tab.svg"));
  // Extra touch icons
  for (const size of [57, 60, 72, 76, 114, 120, 144, 152, 167, 180]) {
    await svgToPng(
      iconSvg,
      size,
      size,
      path.join(OUT_DIR, "icons", `touch-icon-${size}x${size}.png`),
      { flatten: { r: 108, g: 92, b: 231 } }
    );
  }
  // Adaptive icon with padding
  await svgToPng(iconSvg, 432, 432, path.join(OUT_DIR, "icons", "adaptive-icon-432x432.png"));

  // ──────────────────────────────────
  //  2. LOGOS
  // ──────────────────────────────────
  console.log("\n🎨 2/7  Logo Variations");
  const logoMainSvg = await readSvg("logo-main.svg");
  const logoMonoLightSvg = await readSvg("logo-mono-light.svg");
  const logoMonoDarkSvg = await readSvg("logo-mono-dark.svg");

  // Full color logo
  await svgToPng(logoMainSvg, 512, 512, path.join(OUT_DIR, "logos", "logo-full-color-512.png"));
  await svgToPng(logoMainSvg, 256, 256, path.join(OUT_DIR, "logos", "logo-full-color-256.png"));
  await svgToPng(logoMainSvg, 128, 128, path.join(OUT_DIR, "logos", "logo-full-color-128.png"));
  await svgToWebp(logoMainSvg, 512, 512, path.join(OUT_DIR, "logos", "logo-full-color-512.webp"));
  await copySvg("logo-main.svg", path.join(OUT_DIR, "logos", "logo-full-color.svg"));

  // Monochrome for dark backgrounds
  await svgToPng(logoMonoLightSvg, 512, 512, path.join(OUT_DIR, "logos", "logo-mono-for-dark-bg-512.png"));
  await svgToPng(logoMonoLightSvg, 256, 256, path.join(OUT_DIR, "logos", "logo-mono-for-dark-bg-256.png"));
  await copySvg("logo-mono-light.svg", path.join(OUT_DIR, "logos", "logo-mono-for-dark-bg.svg"));

  // Monochrome for light backgrounds
  await svgToPng(logoMonoDarkSvg, 512, 512, path.join(OUT_DIR, "logos", "logo-mono-for-light-bg-512.png"));
  await svgToPng(logoMonoDarkSvg, 256, 256, path.join(OUT_DIR, "logos", "logo-mono-for-light-bg-256.png"));
  await copySvg("logo-mono-dark.svg", path.join(OUT_DIR, "logos", "logo-mono-for-light-bg.svg"));

  // Icon-only (no text)
  await svgToPng(iconSvg, 512, 512, path.join(OUT_DIR, "logos", "logo-icon-only-512.png"));
  await svgToPng(iconSvg, 256, 256, path.join(OUT_DIR, "logos", "logo-icon-only-256.png"));
  await svgToPng(iconSvg, 128, 128, path.join(OUT_DIR, "logos", "logo-icon-only-128.png"));
  await svgToPng(iconSvg, 64, 64, path.join(OUT_DIR, "logos", "logo-icon-only-64.png"));
  await svgToWebp(iconSvg, 512, 512, path.join(OUT_DIR, "logos", "logo-icon-only-512.webp"));
  await copySvg("logo-icon.svg", path.join(OUT_DIR, "logos", "logo-icon-only.svg"));

  // ──────────────────────────────────
  //  3. SPLASH / LOADING SCREENS
  // ──────────────────────────────────
  console.log("\n🖼️  3/7  Splash & Loading Screens");
  const splashSvg = await readSvg("splash-screen.svg");
  const loadingBgSvg = await readSvg("loading-background.svg");

  // Common mobile splash sizes
  await svgToPng(splashSvg, 1080, 1920, path.join(OUT_DIR, "splash", "splash-1080x1920.png"));
  await svgToPng(splashSvg, 750, 1334, path.join(OUT_DIR, "splash", "splash-750x1334.png"));
  await svgToPng(splashSvg, 1242, 2208, path.join(OUT_DIR, "splash", "splash-1242x2208.png"));
  await svgToPng(splashSvg, 1125, 2436, path.join(OUT_DIR, "splash", "splash-1125x2436.png"));
  await svgToPng(splashSvg, 828, 1792, path.join(OUT_DIR, "splash", "splash-828x1792.png"));
  // Desktop splash / loading
  await svgToPng(splashSvg, 1920, 1080, path.join(OUT_DIR, "splash", "splash-desktop-1920x1080.png"));
  // Loading backgrounds
  await svgToPng(loadingBgSvg, 1920, 1080, path.join(OUT_DIR, "splash", "loading-bg-1920x1080.png"));
  await svgToPng(loadingBgSvg, 1200, 630, path.join(OUT_DIR, "splash", "loading-bg-1200x630.png"));
  await copySvg("loading-background.svg", path.join(OUT_DIR, "splash", "loading-bg.svg"));

  // ──────────────────────────────────
  //  4. SOCIAL MEDIA / OPEN GRAPH
  // ──────────────────────────────────
  console.log("\n🌐 4/7  Social Media / Open Graph");
  const ogSvg = await readSvg("og-image.svg");
  const twitterSvg = await readSvg("twitter-image.svg");

  await svgToPng(ogSvg, 1200, 630, path.join(OUT_DIR, "social", "og-image-1200x630.png"));
  await svgToWebp(ogSvg, 1200, 630, path.join(OUT_DIR, "social", "og-image-1200x630.webp"));
  await svgToPng(twitterSvg, 1200, 675, path.join(OUT_DIR, "social", "twitter-image-1200x675.png"));
  // LinkedIn (same as OG is fine, 1200x627)
  await svgToPng(ogSvg, 1200, 627, path.join(OUT_DIR, "social", "linkedin-image-1200x627.png"));
  // WhatsApp (square preview)
  await svgToPng(ogSvg, 600, 315, path.join(OUT_DIR, "social", "whatsapp-preview-600x315.png"));

  // ──────────────────────────────────
  //  5. IN-GAME / UI ASSETS
  // ──────────────────────────────────
  console.log("\n🎮 5/7  In-Game / UI Assets");

  // Game icon for menus
  await svgToPng(iconSvg, 96, 96, path.join(OUT_DIR, "ui", "game-icon-96.png"));
  await svgToPng(iconSvg, 64, 64, path.join(OUT_DIR, "ui", "game-icon-64.png"));
  await svgToPng(iconSvg, 48, 48, path.join(OUT_DIR, "ui", "game-icon-48.png"));

  // Button icons
  const uiIcons = ["play", "pause", "restart", "sound_on", "sound_off", "home", "settings"];
  for (const name of uiIcons) {
    const svg = makeUiIconSvg(name);
    await svgToPng(svg, 64, 64, path.join(OUT_DIR, "ui", `btn-${name}-64.png`));
    await svgToPng(svg, 48, 48, path.join(OUT_DIR, "ui", `btn-${name}-48.png`));
    await svgToPng(svg, 32, 32, path.join(OUT_DIR, "ui", `btn-${name}-32.png`));
    await svgToWebp(svg, 64, 64, path.join(OUT_DIR, "ui", `btn-${name}-64.webp`));
  }

  // Achievement / medal icons
  const medals = [
    { color1: "#fbbf24", color2: "#f59e0b", label: "★", name: "gold" },
    { color1: "#94a3b8", color2: "#64748b", label: "★", name: "silver" },
    { color1: "#d97706", color2: "#b45309", label: "★", name: "bronze" },
    { color1: "#6C5CE7", color2: "#a855f7", label: "♛", name: "champion" },
    { color1: "#10b981", color2: "#059669", label: "✓", name: "complete" },
    { color1: "#ef4444", color2: "#dc2626", label: "🔥", name: "streak" },
  ];
  for (const medal of medals) {
    const svg = makeMedalSvg(medal.color1, medal.color2, medal.label);
    await svgToPng(svg, 128, 128, path.join(OUT_DIR, "ui", "medals", `medal-${medal.name}-128.png`));
    await svgToPng(svg, 64, 64, path.join(OUT_DIR, "ui", "medals", `medal-${medal.name}-64.png`));
  }

  // Game background tile
  const gameBgSvg = makeGameBgSvg();
  await svgToPng(gameBgSvg, 400, 400, path.join(OUT_DIR, "ui", "game-bg-tile-400.png"));
  await svgToPng(gameBgSvg, 800, 800, path.join(OUT_DIR, "ui", "game-bg-tile-800.png"));
  await svgToWebp(gameBgSvg, 800, 800, path.join(OUT_DIR, "ui", "game-bg-tile-800.webp"));

  // ──────────────────────────────────
  //  6. CARD SPRITES
  // ──────────────────────────────────
  console.log("\n🃏 6/7  Card Sprites");

  // Card back
  const cardBackSvg = await readSvg("card-back.svg");
  await svgToPng(cardBackSvg, 200, 280, path.join(OUT_DIR, "cards", "card-back-200x280.png"));
  await svgToPng(cardBackSvg, 150, 210, path.join(OUT_DIR, "cards", "card-back-150x210.png"));
  await svgToPng(cardBackSvg, 100, 140, path.join(OUT_DIR, "cards", "card-back-100x140.png"));
  await svgToWebp(cardBackSvg, 200, 280, path.join(OUT_DIR, "cards", "card-back-200x280.webp"));
  await copySvg("card-back.svg", path.join(OUT_DIR, "cards", "card-back.svg"));

  // Card front base
  const cardFrontSvg = await readSvg("card-front-base.svg");
  await svgToPng(cardFrontSvg, 200, 280, path.join(OUT_DIR, "cards", "card-front-base-200x280.png"));
  await copySvg("card-front-base.svg", path.join(OUT_DIR, "cards", "card-front-base.svg"));

  // Card symbols (16 unique pairs for memory match)
  const cardSymbols = [
    { emoji: "🌟", name: "star" },
    { emoji: "🎈", name: "balloon" },
    { emoji: "🦋", name: "butterfly" },
    { emoji: "🌺", name: "flower" },
    { emoji: "🍎", name: "apple" },
    { emoji: "🎵", name: "music" },
    { emoji: "⚡", name: "lightning" },
    { emoji: "🌙", name: "moon" },
    { emoji: "🔥", name: "fire" },
    { emoji: "💎", name: "diamond" },
    { emoji: "🎯", name: "target" },
    { emoji: "🚀", name: "rocket" },
    { emoji: "🌈", name: "rainbow" },
    { emoji: "🎪", name: "circus" },
    { emoji: "🧩", name: "puzzle" },
    { emoji: "🎲", name: "dice" },
    { emoji: "🐱", name: "cat" },
    { emoji: "🦊", name: "fox" },
    { emoji: "🐼", name: "panda" },
    { emoji: "🦄", name: "unicorn" },
    { emoji: "🐙", name: "octopus" },
    { emoji: "🦜", name: "parrot" },
    { emoji: "🍕", name: "pizza" },
    { emoji: "🧁", name: "cupcake" },
  ];

  for (const card of cardSymbols) {
    const svg = makeCardSvg(card.emoji, "#6C5CE7", "#a855f7");
    await svgToPng(svg, 200, 280, path.join(OUT_DIR, "cards", `card-${card.name}-200x280.png`));
    await svgToPng(svg, 150, 210, path.join(OUT_DIR, "cards", `card-${card.name}-150x210.png`));
    await svgToPng(svg, 100, 140, path.join(OUT_DIR, "cards", `card-${card.name}-100x140.png`));
    await svgToWebp(svg, 200, 280, path.join(OUT_DIR, "cards", `card-${card.name}-200x280.webp`));
  }

  // Matched state overlay
  const matchedOverlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280">
    <rect width="200" height="280" rx="20" fill="rgba(16,185,129,0.15)"/>
    <rect x="4" y="4" width="192" height="272" rx="17" fill="none" stroke="#10b981" stroke-width="3"/>
    <circle cx="100" cy="140" r="30" fill="#10b981" opacity="0.9"/>
    <text x="100" y="152" font-family="Arial,sans-serif" font-size="30" fill="white" text-anchor="middle" font-weight="bold">✓</text>
  </svg>`;
  await svgToPng(matchedOverlaySvg, 200, 280, path.join(OUT_DIR, "cards", "card-matched-overlay-200x280.png"));

  // ──────────────────────────────────
  //  7. MISC / MARKETING
  // ──────────────────────────────────
  console.log("\n📣 7/7  Misc / Marketing");
  const bannerSvg = await readSvg("banner-marketing.svg");

  // Newsletter / marketing banners
  await svgToPng(bannerSvg, 1200, 400, path.join(OUT_DIR, "marketing", "banner-1200x400.png"));
  await svgToPng(bannerSvg, 600, 200, path.join(OUT_DIR, "marketing", "banner-600x200.png"));
  await svgToWebp(bannerSvg, 1200, 400, path.join(OUT_DIR, "marketing", "banner-1200x400.webp"));
  await copySvg("banner-marketing.svg", path.join(OUT_DIR, "marketing", "banner.svg"));

  // Email header
  await svgToPng(bannerSvg, 800, 267, path.join(OUT_DIR, "marketing", "email-header-800x267.png"));

  // App store style screenshot (reuse splash)
  await svgToPng(splashSvg, 1080, 1920, path.join(OUT_DIR, "marketing", "app-screenshot-1080x1920.png"));
  await svgToPng(splashSvg, 750, 1334, path.join(OUT_DIR, "marketing", "app-screenshot-750x1334.png"));

  // ──────────────────────────────────
  //  SUMMARY
  // ──────────────────────────────────
  console.log("\n" + "=".repeat(40));
  console.log("✅ All assets generated in: public/assets/");

  // Count files
  let count = 0;
  async function countFiles(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          await countFiles(path.join(dir, entry.name));
        } else {
          count++;
        }
      }
    } catch {
      // ignore
    }
  }
  await countFiles(OUT_DIR);
  console.log(`   Total files: ${count}`);
  console.log("");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
