#!/usr/bin/env node
/**
 * Final pass: replace all old stock filenames with the newly downloaded
 * per-service Jessup images.
 */
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

// Old stock filename → new Jessup-sourced filename
const SWAP = {
  // Service hero images
  '"img/commercial.jpg"':        '"img/commercial-img-1.png"',
  '"img/house.jpg"':             '"img/housing-img-1.png"',
  '"img/reno.jpg"':              '"img/reno-img-1.png"',
  '"img/concrete.jpg"':          '"img/concrete-img-1.jpg"',
  '"img/asphalt.jpg"':           '"img/asphalt-img-1.jpg"',
  '"img/roofing.jpg"':           '"img/roofing-img-1.png"',
  '"img/boathouse.jpg"':         '"img/boathouse-img-1.jpg"',
  '"img/seawall.jpg"':           '"img/seawalls-img-1.jpg"',
  '"img/fencing.jpg"':           '"img/fencing-img-1.jpg"',
  '"img/drainage.jpg"':          '"img/drainage-img-1.jpg"',
  '"img/storm.jpg"':             '"img/storm-img-1.jpg"',
  '"img/disaster.jpg"':          '"img/disaster-img-1.jpg"',
  '"img/plans.jpg"':             '"img/plans-img-1.png"',
  '"img/office.jpg"':            '"img/commercial-img-1.png"',
  '"img/outdoor-kitchen.jpg"':   '"img/reno-img-1.png"',
  // Bath/interior photos → Jessup reno gallery
  '"img/bath1.jpg"':             '"img/reno-img-2.png"',
  '"img/bath2.jpg"':             '"img/reno-img-3.png"',
  '"img/bath3.jpg"':             '"img/reno-img-4.png"',
  // More generic card images → real Jessup equivalents
  '"img/house-1.png"':           '"img/housing-img-1.png"',
  '"img/asphalt-1.png"':         '"img/asphalt-img-1.jpg"',
  '"img/roofing-1.png"':         '"img/roofing-img-1.png"',
  '"img/boathouse-1.png"':       '"img/boathouse-img-1.jpg"',
  '"img/boathouse-2.png"':       '"img/boathouse-img-2.png"',
  '"img/boathouse-3.png"':       '"img/boathouse-img-3.png"',
};

const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));
let totalSwaps = 0;

for (const file of htmlFiles) {
  const fp = path.join(DIR, file);
  let content = fs.readFileSync(fp, 'utf8');
  let swaps = 0;

  for (const [from, to] of Object.entries(SWAP)) {
    // Only swap if the target file actually exists
    const targetFile = to.replace(/"/g, '');
    if (!fs.existsSync(path.join(DIR, targetFile))) continue;
    
    const count = content.split(from).length - 1;
    if (count > 0) {
      content = content.split(from).join(to);
      swaps += count;
    }
  }

  if (swaps > 0) {
    fs.writeFileSync(fp, content, 'utf8');
    totalSwaps += swaps;
    console.log(`  ✓ ${file}: ${swaps} stock → Jessup swaps`);
  }
}

console.log(`\n✅ Total: ${totalSwaps} remaining stock images replaced`);

// Final clean audit
console.log('\n=== FINAL SERVICE PAGE IMAGE AUDIT ===');
const svcFiles = fs.readdirSync(DIR).filter(f => f.startsWith('service-') && f.endsWith('.html'));
for (const file of svcFiles) {
  const content = fs.readFileSync(path.join(DIR, file), 'utf8');
  const srcs = [...content.matchAll(/src="(img\/[^"]+)"/g)].map(m => m[1]);
  const uniqueImgs = [...new Set(srcs)].filter(s => !s.includes('logo'));
  const firstImg = uniqueImgs[0] || 'NONE';
  const exists = fs.existsSync(path.join(DIR, firstImg));
  const flag = exists ? '✅' : '❌';
  console.log(`  ${flag} ${file.padEnd(30)} hero: ${firstImg}`);
}
