#!/usr/bin/env node
/**
 * Download every real Jessup Construction image from each service page,
 * then rewrite ALL stock/unsplash image references in every HTML file.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const IMG = path.join(DIR, 'img');
fs.mkdirSync(IMG, { recursive: true });

const BASE = 'https://jessupconstruct.com';

// ── 1. Scrape images from every service page ─────────────────────────────────
const PAGES = [
  '/commercial-construction/',
  '/affordable-housing/',
  '/residential-renovations/',
  '/concrete/',
  '/asphalt-paving/',
  '/roofing/',
  '/boathouse-construction/',
  '/seawalls/',
  '/privacy-fencing/',
  '/drainage/',
  '/storm-damage/',
  '/disaster-relief/',
  '/plan-development-drafting/',
  '/project-portfolio/',
  '/',
];

function curlGet(url) {
  try {
    return execSync(`curl -sL --max-time 10 "${url}"`, { encoding: 'utf8', timeout: 12000 });
  } catch { return ''; }
}

function download(url, dest) {
  if (fs.existsSync(dest)) {
    const size = fs.statSync(dest).size;
    if (size > 5000) return true; // already good
  }
  try {
    execSync(`curl -sL --max-time 15 "${url}" -o "${dest}"`, { timeout: 17000 });
    return fs.existsSync(dest) && fs.statSync(dest).size > 5000;
  } catch { return false; }
}

// Collect all full-size Jessup images (skip resized thumbnails)
const imgRegex = /https:\/\/jessupconstruct\.com\/wp-content\/uploads\/[^"'\s>]+\.(jpg|jpeg|png)/gi;
const thumbRegex = /-\d+x\d+\.(jpg|jpeg|png)$/i;

// Map: page slug → [image urls]
const pageImages = {};

console.log('Scraping Jessup service pages...');
for (const page of PAGES) {
  const slug = page.replace(/\//g, '-').replace(/^-|-$/g, '') || 'home';
  console.log(`  Scraping ${page}...`);
  const html = curlGet(BASE + page);
  const matches = [...html.matchAll(imgRegex)].map(m => m[0]);
  const fullSize = [...new Set(matches)].filter(u => !thumbRegex.test(u));
  pageImages[slug] = fullSize;
  if (fullSize.length) console.log(`    Found ${fullSize.length} images`);
}

// ── 2. Build a named download map ─────────────────────────────────────────────
// serviceName → [ {url, localFile} ]
const SERVICE_IMAGES = {
  'commercial': pageImages['commercial-construction'] || [],
  'housing':    pageImages['affordable-housing'] || [],
  'reno':       pageImages['residential-renovations'] || [],
  'concrete':   pageImages['concrete'] || [],
  'asphalt':    pageImages['asphalt-paving'] || [],
  'roofing':    pageImages['roofing'] || [],
  'boathouse':  pageImages['boathouse-construction'] || [],
  'seawalls':   pageImages['seawalls'] || [],
  'fencing':    pageImages['privacy-fencing'] || [],
  'drainage':   pageImages['drainage'] || [],
  'storm':      pageImages['storm-damage'] || [],
  'disaster':   pageImages['disaster-relief'] || [],
  'plans':      pageImages['plan-development-drafting'] || [],
};

// Also grab all home + portfolio images
const extraImages = [
  ...(pageImages['home'] || []),
  ...(pageImages['project-portfolio'] || []),
];

// ── 3. Download by service ────────────────────────────────────────────────────
console.log('\nDownloading service-specific images...');
const serviceHero = {}; // serviceName → best local file for hero
const serviceGallery = {}; // serviceName → [local files]

// Always skip pure icon/logo files
const SKIP_PATTERNS = ['arrow-white', 'cropped-jessup-logo', 'Untitled-design-71', '1.png', '1-480'];

for (const [svc, urls] of Object.entries(SERVICE_IMAGES)) {
  serviceGallery[svc] = [];
  let idx = 1;
  for (const url of urls) {
    if (SKIP_PATTERNS.some(p => url.includes(p))) continue;
    const ext = url.split('.').pop().split('?')[0].toLowerCase();
    const localName = `${svc}-img-${idx}.${ext}`;
    const dest = path.join(IMG, localName);
    console.log(`  [${svc}] ${idx}: ${path.basename(url)}`);
    const ok = download(url, dest);
    if (ok) {
      serviceGallery[svc].push(`img/${localName}`);
      if (!serviceHero[svc]) serviceHero[svc] = `img/${localName}`;
      idx++;
    }
    if (idx > 8) break; // max 8 per service
  }
  if (serviceGallery[svc].length) {
    console.log(`  ✅ ${svc}: ${serviceGallery[svc].length} images`);
  } else {
    console.log(`  ⚠️  ${svc}: no images found`);
  }
}

// Download extra home/portfolio images
console.log('\nDownloading extra project images...');
let extraIdx = 1;
const extraLocal = [];
for (const url of extraImages) {
  if (SKIP_PATTERNS.some(p => url.includes(p))) continue;
  const ext = url.split('.').pop().split('?')[0].toLowerCase();
  const localName = `extra-${extraIdx}.${ext}`;
  const dest = path.join(IMG, localName);
  const ok = download(url, dest);
  if (ok) {
    extraLocal.push(`img/${localName}`);
    extraIdx++;
  }
  if (extraIdx > 20) break;
}
console.log(`Extra: ${extraLocal.length} images`);

// ── 4. Build replacement map ──────────────────────────────────────────────────
// Stock filenames that need to be replaced → service-specific real image
const get = (svc, fallback) => serviceHero[svc] || serviceGallery[svc]?.[0] || extraLocal[0] || fallback;

const STOCK_REPLACE = {
  // These are Unsplash downloads that need replacing
  '"img/commercial.jpg"':       `"${get('commercial', 'img/boise-1.jpg')}"`,
  '"img/house.jpg"':            `"${get('housing', 'img/house-1.png')}"`,
  '"img/reno.jpg"':             `"${get('reno', 'img/reno-1.jpg')}"`,
  '"img/concrete.jpg"':         `"${get('concrete', 'img/concrete-1.jpg')}"`,
  '"img/asphalt.jpg"':          `"${get('asphalt', 'img/asphalt-1.png')}"`,
  '"img/roofing.jpg"':          `"${get('roofing', 'img/roofing-1.png')}"`,
  '"img/boathouse.jpg"':        `"${get('boathouse', 'img/boathouse-1.png')}"`,
  '"img/seawall.jpg"':          `"${get('seawalls', 'img/seawall-1.png')}"`,
  '"img/fencing.jpg"':          `"${get('fencing', 'img/fencing-1.jpg')}"`,
  '"img/drainage.jpg"':         `"${get('drainage', 'img/drainage-1.jpg')}"`,
  '"img/storm.jpg"':            `"${get('storm', 'img/project-hero.jpg')}"`,
  '"img/disaster.jpg"':         `"${get('disaster', 'img/drone-1.jpg')}"`,
  '"img/plans.jpg"':            `"${get('plans', 'img/jessup-3.png')}"`,
  '"img/office.jpg"':           `"${get('commercial', 'img/boise-1.jpg')}"`,
  '"img/outdoor-kitchen.jpg"':  `"${get('reno', 'img/spirits-1.jpg')}"`,
  '"img/bath1.jpg"':            `"${serviceGallery['reno']?.[1] || 'img/reno-2.jpg'}"`,
  '"img/bath2.jpg"':            `"${serviceGallery['reno']?.[2] || 'img/reno-3.jpg'}"`,
  '"img/bath3.jpg"':            `"${serviceGallery['reno']?.[3] || 'img/reno-4.jpg'}"`,
};

// ── 5. Rewrite all HTML files ─────────────────────────────────────────────────
console.log('\nRewriting HTML files...');
const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
let totalReplaced = 0;

for (const file of htmlFiles) {
  const fp = path.join(DIR, file);
  let content = fs.readFileSync(fp, 'utf8');
  let changed = 0;

  for (const [stock, real] of Object.entries(STOCK_REPLACE)) {
    const before = content;
    content = content.split(stock).join(real);
    if (content !== before) changed++;
  }

  // Additionally: replace any remaining Unsplash URLs still present
  const unsplashBefore = (content.match(/images\.unsplash\.com/g) || []).length;
  if (unsplashBefore > 0) {
    content = content.replace(/https:\/\/images\.unsplash\.com[^"']*/g, extraLocal[0] || 'img/project-hero.jpg');
    changed += unsplashBefore;
  }

  if (changed > 0) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log(`  ✓ ${file}: ${changed} replacements`);
    totalReplaced += changed;
  }
}

// ── 6. Final summary ──────────────────────────────────────────────────────────
console.log(`\n✅ Done: ${totalReplaced} stock references replaced`);
console.log('\nService hero images assigned:');
for (const [svc, src] of Object.entries(serviceHero)) {
  console.log(`  ${svc.padEnd(12)} → ${src}`);
}

console.log('\n⚠️  Any remaining non-local image srcs:');
let clean = true;
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(DIR, file), 'utf8');
  const remote = (content.match(/src="https?:\/\/[^"]+\.(jpg|jpeg|png)/gi) || []);
  if (remote.length) {
    console.log(`  ${file}: ${remote.join(', ')}`);
    clean = false;
  }
}
if (clean) console.log('  None — all images are local! ✅');
