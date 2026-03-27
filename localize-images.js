#!/usr/bin/env node
/**
 * Replace all external image URLs across every HTML file with local img/ paths.
 * Maps Unsplash photos and Jessup remote URLs → local img/ filenames.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;

// Map: [partial URL pattern] → local filename
// Order matters — more specific patterns first
const IMAGE_MAP = [
  // === JESSUP REMOTE → LOCAL ===
  ['2024/08/isnetworld.jpeg',                       'img/isnetworld.jpg'],
  ['2025/07/Jessup-Construction-3.png',             'img/jessup-3.png'],
  ['2025/07/Jessup-Construction-2.png',             'img/jessup-2.png'],
  ['2021/10/Untitled-design-71',                    'img/logo.png'],
  // Boise project photos
  ['158264937_900673897142442',                     'img/boise-1.jpg'],
  ['158394224_900673683809130',                     'img/boise-2.jpg'],
  ['158396297_900673937142438',                     'img/boise-3.jpg'],
  ['158534291_900673987142433',                     'img/boise-4.jpg'],
  ['158591108_900673627142469',                     'img/boise-5.jpg'],
  ['158608400_900673797142452',                     'img/boise-6.jpg'],
  ['158884419_900673747142457',                     'img/boise-7.jpg'],
  ['158885969_900673657142466',                     'img/boise-8.jpg'],
  // Core project images
  ['117729851_758571411352692',                     'img/project-hero.jpg'],
  ['118070492_758571381352695',                     'img/concrete-1.jpg'],
  ['117764678_758571464686020',                     'img/drainage-1.jpg'],
  // Seawall
  ['Screen-Shot-2021-12-21',                        'img/seawall-1.png'],
  ['Screen-Shot-2022-02-03',                        'img/seawall-2.jpg'],
  ['Screen-Shot-2021-11-08-at-7.22.26',             'img/seawall-3.png'],
  ['Screen-Shot-2021-11-08-at-7.22.36',             'img/seawall-4.png'],
  ['Screen-Shot-2021-11-08-at-7.22.40',             'img/seawall-5.png'],
  // Spirits outdoor seating
  ['Screen-Shot-2022-04-28',                        'img/spirits-1.jpg'],
  // Fencing
  ['Image-1-2-scaled',                              'img/fencing-2.jpg'],
  ['Image-1-3-scaled',                              'img/fencing-3.jpg'],
  ['Image-1-scaled',                                'img/fencing-1.jpg'],
  // Drone shots
  ['DJI_0408',                                      'img/drone-1.jpg'],
  ['DJI_0411',                                      'img/drone-2.jpg'],
  ['DJI_0413',                                      'img/drone-3.jpg'],
  // Reno photos
  ['IMG_2430',                                      'img/reno-1.jpg'],
  ['IMG_2432',                                      'img/reno-2.jpg'],
  ['IMG_2433',                                      'img/reno-3.jpg'],
  ['IMG_2438',                                      'img/reno-4.jpg'],
  ['IMG_2442',                                      'img/reno-5.jpg'],
  ['IMG_2473',                                      'img/reno-6.jpg'],
  ['IMG_2474',                                      'img/reno-7.jpg'],
  ['IMG_2477',                                      'img/reno-8.jpg'],
  ['IMG_2479',                                      'img/reno-9.jpg'],
  ['IMG_2481',                                      'img/reno-10.jpg'],
  ['IMG_2482',                                      'img/reno-11.jpg'],
  ['IMG_2484',                                      'img/reno-12.jpg'],
  ['IMG_2485',                                      'img/reno-13.jpg'],

  // === UNSPLASH → LOCAL ===
  // Commercial / construction site
  ['photo-1504307651254',                           'img/boise-3.jpg'],
  // House / residential
  ['photo-1570129477492',                           'img/house.jpg'],
  // Reno interior
  ['photo-1558618666-fcd25c85cd64',                 'img/reno-1.jpg'],
  // Concrete
  ['photo-1597762117709',                           'img/concrete-1.jpg'],
  // Asphalt
  ['photo-1546213290',                              'img/asphalt.jpg'],
  // Roofing
  ['photo-1632236542346',                           'img/roofing-1.png'],
  ['photo-1605152276897',                           'img/roofing-1.png'],
  // Boathouse / waterfront
  ['photo-1558618047',                              'img/boathouse-1.png'],
  ['photo-1601933573795',                           'img/boathouse-2.png'],
  // Seawall / water
  ['photo-1505118380757',                           'img/seawall-1.png'],
  // Fencing
  ['photo-1508193638397',                           'img/fencing-1.jpg'],
  // Drainage / site work
  ['photo-1541888946425',                           'img/drainage-1.jpg'],
  // Storm damage
  ['photo-1523576568769',                           'img/project-hero.jpg'],
  ['photo-1562259929',                              'img/storm.jpg'],
  // Disaster
  ['photo-1590650046871',                           'img/drone-1.jpg'],
  // Plans / blueprints
  ['photo-1503387762',                              'img/jessup-3.png'],
  // Office interior
  ['photo-1497366216548',                           'img/boise-1.jpg'],
  // Outdoor kitchen
  ['photo-1600585154340',                           'img/spirits-1.jpg'],
  // Bath photos
  ['photo-1552321554',                              'img/reno-10.jpg'],
  ['photo-1507652313519',                           'img/reno-11.jpg'],
  ['photo-1484154218962',                           'img/reno-12.jpg'],
  // Careers / hero
  ['photo-1503387762-592deb58ef4e',                 'img/jessup-3.png'],
];

function replaceImages(html) {
  let result = html;
  for (const [pattern, local] of IMAGE_MAP) {
    // Replace any occurrence of the pattern inside a quoted attribute value
    // Handle both full URLs and partial matches
    const regex = new RegExp(
      `(https://[^"']*${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"']*)`,
      'g'
    );
    result = result.replace(regex, local);
  }
  return result;
}

const htmlFiles = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));

let totalReplaced = 0;
for (const file of htmlFiles) {
  const fp = path.join(DIR, file);
  const original = fs.readFileSync(fp, 'utf8');
  const updated = replaceImages(original);
  
  // Count changes
  const changes = (original.match(/unsplash|jessupconstruct\.com\/wp-content/g) || []).length;
  const remaining = (updated.match(/unsplash|jessupconstruct\.com\/wp-content/g) || []).length;
  const replaced = changes - remaining;
  totalReplaced += replaced;
  
  fs.writeFileSync(fp, updated, 'utf8');
  console.log(`✓ ${file}: ${replaced} images localized (${remaining} remote remaining)`);
}

console.log(`\n✅ Total: ${totalReplaced} image URLs localized across ${htmlFiles.length} HTML files`);

// Report any still-remote img src tags
console.log('\n=== Still using remote images ===');
for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(DIR, file), 'utf8');
  const matches = content.match(/src="https?:\/\/[^"]+\.(jpg|jpeg|png|gif|webp)/gi) || [];
  if (matches.length) {
    console.log(`${file}:`);
    matches.forEach(m => console.log(`  ${m}`));
  }
}
