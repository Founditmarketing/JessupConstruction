#!/usr/bin/env node
/**
 * Mirror the OG site image placements onto our new site.
 * Based on visual inspection of each photo and its OG page context.
 */
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

// Per-file: list of [currentSrc, correctSrc, why]
// Based on: visual inspection + which OG page the image lived on
const PLACEMENTS = {

  // ── service-commercial.html ──────────────────────────────────────────────────
  // OG commercial page showed: industrial welding, Jessup-branded machinery
  'service-commercial.html': [
    // Hero → welder at industrial facility (exactly what OG commercial page showed)
    [/src="img\/[^"]*"/, 'src="img/commercial-office-1.jpg"', 'hero: welder/industrial = commercial page hero on OG'],
  ],

  // ── service-housing.html ──────────────────────────────────────────────────
  // OG housing page showed: octagon porch ceiling, fireplace mantle, exterior shots
  'service-housing.html': [
    [/src="img\/[^"]*"/, 'src="img/housing-home-1.jpg"', 'hero: octagon wood porch ceiling = housing page hero'],
  ],

  // ── service-reno.html ──────────────────────────────────────────────────
  // OG reno page showed: 2024 bathroom/kitchen remodel shots (IMG_2430+)
  'service-reno.html': [
    [/src="img\/[^"]*"/, 'src="img/reno-bathroom-1.jpg"', 'hero: renovated commercial interior = reno page hero'],
  ],

  // ── service-boathouse.html ──────────────────────────────────────────────────
  // OG boathouse page: dock with boathouse at end, party deck boathouse
  'service-boathouse.html': [
    [/src="img\/[^"]*"/, 'src="img/boathouse-hero-1.jpg"', 'hero: beautiful dock/pier = boathouse page primary image'],
  ],

  // ── service-seawalls.html ──────────────────────────────────────────────────
  // OG seawalls page: lake with seawall grading work
  'service-seawalls.html': [
    [/src="img\/[^"]*"/, 'src="img/seawall-project-1.jpg"', 'hero: lakeside seawall grading = seawalls page'],
  ],

  // ── service-fencing.html ──────────────────────────────────────────────────
  // OG fencing page: wood privacy fence beside pool
  'service-fencing.html': [
    [/src="img\/[^"]*"/, 'src="img/fencing-gate-1.jpg"', 'hero: cedar privacy fence by pool = fencing page hero'],
  ],

  // ── service-storm.html ──────────────────────────────────────────────────
  // OG storm damage page: barn with blown-off roof
  'service-storm.html': [
    [/src="img\/[^"]*"/, 'src="img/storm-damage-1.jpg"', 'hero: blown-off barn roof = storm damage page'],
  ],

  // ── service-disaster.html ──────────────────────────────────────────────────
  // OG disaster relief page: tree through house structure
  'service-disaster.html': [
    [/src="img\/[^"]*"/, 'src="img/disaster-relief-1.jpg"', 'hero: tree fallen through home = disaster page'],
  ],

  // ── service-drainage.html ──────────────────────────────────────────────────
  // OG drainage page: drain grate in dirt lot
  'service-drainage.html': [
    [/src="img\/[^"]*"/, 'src="img/drainage-site-1.jpg"', 'hero: storm drain grate = drainage page'],
  ],

};

// Apply replacements surgically — only replace the FIRST hero img src in each file
let totalFixed = 0;
for (const [file, replacements] of Object.entries(PLACEMENTS)) {
  const fp = path.join(DIR, file);
  if (!fs.existsSync(fp)) { console.log(`  SKIP (missing): ${file}`); continue; }

  let content = fs.readFileSync(fp, 'utf8');

  for (const [pattern, replacement, reason] of replacements) {
    // Only replace the first occurrence (hero image)
    const match = content.match(pattern);
    if (match && match[0] !== replacement) {
      content = content.replace(pattern, replacement);
      console.log(`  ✅ ${file}: set to ${reason}`);
      totalFixed++;
    }
  }

  fs.writeFileSync(fp, content, 'utf8');
}

// ── Now fix index.html service cards to mirror OG homepage ─────────────────
// OG homepage service tiles: each links to its service with a representative image
// Read the current index and patch the src for each service card
const indexPath = path.join(DIR, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// The OG site used these images for its home service grid (matching what we saw)
const INDEX_CARD_SWAPS = [
  // Commercial card → welder/industrial (OG commercial page hero)
  ['commercial-img-1.png', 'commercial-office-1.jpg'],
  // Housing card → wood porch ceiling (OG housing hero)
  ['housing-img-1.png', 'housing-home-1.jpg'],
  // Reno card → reno interior (OG reno page)
  ['reno-img-1.png', 'reno-bathroom-1.jpg'],
  // Boathouse card → iconic dock photo (OG boathouse hero)
  ['boathouse-img-1.jpg', 'boathouse-hero-1.jpg'],
  // Seawall card → lake/seawall grading
  ['seawalls-img-1.jpg', 'seawall-project-1.jpg'],
  // Fencing card → privacy fence by pool
  ['fencing-img-1.jpg', 'fencing-gate-1.jpg'],
  // Storm card → blown-off roof
  ['storm-img-1.jpg', 'storm-damage-1.jpg'],
  // Disaster card → tree through house
  ['disaster-img-1.jpg', 'disaster-relief-1.jpg'],
  // Drainage card → drain grate
  ['drainage-img-1.jpg', 'drainage-site-1.jpg'],
];

let indexSwaps = 0;
for (const [from, to] of INDEX_CARD_SWAPS) {
  if (indexContent.includes(`img/${from}`)) {
    indexContent = indexContent.split(`img/${from}`).join(`img/${to}`);
    indexSwaps++;
  }
}
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log(`  ✅ index.html: ${indexSwaps} service card images updated`);
totalFixed += indexSwaps;

// ── Same for services.html ──────────────────────────────────────────────────
const servicesPath = path.join(DIR, 'services.html');
let servicesContent = fs.readFileSync(servicesPath, 'utf8');
let servicesSwaps = 0;
for (const [from, to] of INDEX_CARD_SWAPS) {
  if (servicesContent.includes(`img/${from}`)) {
    servicesContent = servicesContent.split(`img/${from}`).join(`img/${to}`);
    servicesSwaps++;
  }
}
fs.writeFileSync(servicesPath, servicesContent, 'utf8');
console.log(`  ✅ services.html: ${servicesSwaps} service card images updated`);
totalFixed += servicesSwaps;

// ── Fix projects.html ───────────────────────────────────────────────────────
// OG portfolio: boise=office remodel, maryhill=home build, boathouse, seawall, outdoor kitchen
const projectsPath = path.join(DIR, 'projects.html');
let projContent = fs.readFileSync(projectsPath, 'utf8');
const PROJ_SWAPS = [
  ['boathouse-img-1.jpg', 'boathouse-hero-1.jpg'],   // boathouse project card
  ['boathouse-img-2.png', 'boathouse-party-1.jpg'],  // boathouse second photo
  ['seawalls-img-1.jpg', 'seawall-project-1.jpg'],   // seawall project card
  ['fencing-img-1.jpg', 'fencing-gate-1.jpg'],       // fencing project
  ['storm-img-1.jpg', 'storm-damage-1.jpg'],         // storm project
  ['disaster-img-1.jpg', 'disaster-relief-1.jpg'],   // disaster project
  ['commercial-img-1.png', 'commercial-office-2.jpg'], // industrial project card
  ['housing-img-1.png', 'housing-home-1.jpg'],       // maryhill home
  ['reno-img-1.png', 'reno-bathroom-1.jpg'],         // bathroom remodel project
];
let projSwaps = 0;
for (const [from, to] of PROJ_SWAPS) {
  if (projContent.includes(`img/${from}`)) {
    projContent = projContent.split(`img/${from}`).join(`img/${to}`);
    projSwaps++;
  }
}
fs.writeFileSync(projectsPath, projContent, 'utf8');
console.log(`  ✅ projects.html: ${projSwaps} project card images updated`);
totalFixed += projSwaps;

console.log(`\n✅ Total: ${totalFixed} images correctly placed by OG site context`);

// Final audit
console.log('\n=== SERVICE PAGE HEROES (final) ===');
const svcFiles = fs.readdirSync(DIR).filter(f => f.startsWith('service-') && f.endsWith('.html'));
for (const file of svcFiles) {
  const content = fs.readFileSync(path.join(DIR, file), 'utf8');
  const match = content.match(/src="(img\/[^"]+)"/);
  const hero = match ? match[1] : 'NONE';
  const exists = fs.existsSync(path.join(DIR, hero));
  console.log(`  ${exists ? '✅' : '❌'} ${file.padEnd(30)} → ${hero}`);
}
