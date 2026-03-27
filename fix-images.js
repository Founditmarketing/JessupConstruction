#!/usr/bin/env node
/**
 * Second pass: swap in better, more thematically accurate Jessup images
 * for service pages, index hero cards, and projects.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;

// Targeted per-file replacements
// [file, oldSrc, newSrc, description]
const TARGETED = [

  // ── index.html ──────────────────────────────────────────────
  // Commercial service card
  ['index.html', 'img/boise-3.jpg',       'img/boise-1.jpg',       'commercial card hero'],
  // Seawall about-preview photo
  ['index.html', 'img/project-hero.jpg',  'img/seawall-2.jpg',     'about preview photo'],
  // Concrete service card
  ['index.html', 'img/concrete-1.jpg',    'img/concrete-1.jpg',    'concrete card (keep)'],
  // Drainage service card
  ['index.html', 'img/drainage-1.jpg',    'img/drainage-1.jpg',    'drainage card (keep)'],
  // Fencing service card
  ['index.html', 'img/fencing-1.jpg',     'img/fencing-1.jpg',     'fencing card (keep)'],
  // Maryhill project card – use a reno photo
  ['index.html', 'img/house.jpg',         'img/reno-5.jpg',        'maryhill project photo'],
  // Boathouse project card
  ['index.html', 'img/boathouse-1.png',   'img/boathouse-2.png',   'boathouse project card'],

  // ── service-commercial.html ──────────────────────────────────
  ['service-commercial.html', 'img/boise-3.jpg',   'img/boise-1.jpg',  'commercial hero'],
  ['service-commercial.html', 'img/boise-3.jpg',   'img/boise-1.jpg',  'commercial fallback'],

  // ── service-housing.html ─────────────────────────────────────
  ['service-housing.html', 'img/house.jpg',   'img/house-1.png',  'housing hero'],

  // ── service-reno.html ────────────────────────────────────────
  ['service-reno.html', 'img/reno-1.jpg',   'img/reno-5.jpg',  'reno hero'],

  // ── service-roofing.html ─────────────────────────────────────
  ['service-roofing.html', 'img/roofing-1.png',   'img/roofing-1.png',  'roofing hero (keep)'],

  // ── service-asphalt.html ─────────────────────────────────────
  ['service-asphalt.html', 'img/asphalt.jpg',   'img/asphalt-1.png',  'asphalt hero'],

  // ── service-boathouse.html ───────────────────────────────────
  ['service-boathouse.html', 'img/boathouse-1.png',   'img/boathouse-1.png',  'boathouse hero (keep)'],

  // ── service-seawalls.html ────────────────────────────────────
  ['service-seawalls.html', 'img/project-hero.jpg',   'img/seawall-2.jpg',  'seawalls hero'],

  // ── service-fencing.html ─────────────────────────────────────
  ['service-fencing.html', 'img/fencing-1.jpg',   'img/fencing-2.jpg',  'fencing hero'],

  // ── service-drainage.html ────────────────────────────────────
  ['service-drainage.html', 'img/drainage-1.jpg',   'img/drainage-1.jpg',  'drainage hero (keep)'],

  // ── service-storm.html ───────────────────────────────────────
  ['service-storm.html', 'img/project-hero.jpg',   'img/drone-1.jpg',  'storm hero'],

  // ── service-disaster.html ────────────────────────────────────
  ['service-disaster.html', 'img/drone-1.jpg',   'img/drone-2.jpg',  'disaster hero'],

  // ── service-plans.html ───────────────────────────────────────
  ['service-plans.html', 'img/jessup-3.png',   'img/jessup-2.png',  'plans hero'],

  // ── projects.html ────────────────────────────────────────────
  // Boise office remodel → real Boise photos
  ['projects.html', 'img/boise-3.jpg',   'img/boise-1.jpg',   'boise project #1'],
  // Maryhill home → reno photo
  ['projects.html', 'img/reno-5.jpg',    'img/reno-5.jpg',    'maryhill (keep reno)'],
  // Boathouse → real boathouse screens
  ['projects.html', 'img/boathouse-1.png',  'img/boathouse-2.png',  'boathouse project'],
  // Industrial project → drone shot
  ['projects.html', 'img/boise-3.jpg',   'img/drone-3.jpg',   'industrial project'],
  // Concrete project → real concrete photo
  ['projects.html', 'img/concrete-1.jpg', 'img/concrete-1.jpg', 'concrete project (keep)'],
  // Outdoor kitchen → spirits photo
  ['projects.html', 'img/outdoor-kitchen.jpg', 'img/spirits-1.jpg', 'outdoor kitchen/spirits'],
  // Bath remodel photos → real reno photos
  ['projects.html', 'img/reno-10.jpg',   'img/reno-10.jpg',   'bath1 reno (keep)'],
  ['projects.html', 'img/reno-11.jpg',   'img/reno-11.jpg',   'bath2 reno (keep)'],
  ['projects.html', 'img/reno-12.jpg',   'img/reno-12.jpg',   'bath3 reno (keep)'],

  // ── about.html ───────────────────────────────────────────────
  ['about.html', 'img/seawall-2.jpg',  'img/project-hero.jpg', 'about story image'],

  // ── services.html ────────────────────────────────────────────
  ['services.html', 'img/boise-3.jpg',   'img/boise-1.jpg',    'commercial card'],
  ['services.html', 'img/boathouse-1.png', 'img/boathouse-2.png', 'boathouse card'],
];

let count = 0;
const fileChanges = {};

for (const [file, oldSrc, newSrc, desc] of TARGETED) {
  if (oldSrc === newSrc) continue; // skip no-ops
  const fp = path.join(DIR, file);
  if (!fs.existsSync(fp)) continue;
  
  let content = fs.readFileSync(fp, 'utf8');
  // Replace first occurrence only to avoid over-replacing
  if (content.includes(oldSrc)) {
    content = content.replace(oldSrc, newSrc);
    fs.writeFileSync(fp, content, 'utf8');
    fileChanges[file] = (fileChanges[file] || 0) + 1;
    count++;
  }
}

console.log(`✅ Made ${count} targeted image improvements:`);
Object.entries(fileChanges).forEach(([f, n]) => console.log(`  ${f}: ${n} swaps`));

// Final audit
console.log('\n=== Final image audit (remote URLs remaining) ===');
const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
let totalRemote = 0;
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(DIR, file), 'utf8');
  const remoteImgs = (content.match(/src="https?:\/\/[^"]+\.(jpg|jpeg|png|gif|webp)/gi) || []);
  const remoteVids = (content.match(/src="https?:\/\/[^"]+\.(mp4|mov|webm)/gi) || []);
  if (remoteImgs.length) {
    totalRemote += remoteImgs.length;
    console.log(`  ${file}: ${remoteImgs.length} remote images`);
    remoteImgs.forEach(u => console.log(`    ${u.substring(0, 80)}`));
  }
  if (remoteVids.length) {
    console.log(`  ${file}: ${remoteVids.length} remote videos (intentional - hosted on Jessup)`);
  }
}
if (totalRemote === 0) console.log('  ✓ Zero broken remote image refs!');

console.log('\n=== Local img/ files available ===');
if (fs.existsSync(path.join(DIR, 'img'))) {
  const imgs = fs.readdirSync(path.join(DIR, 'img'));
  console.log(`  ${imgs.length} local images ready`);
}
