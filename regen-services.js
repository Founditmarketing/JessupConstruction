#!/usr/bin/env node
/**
 * Regenerate all 13 service pages with:
 * - Fixed nav logo (always img/logo.png)
 * - Single compact content section (no duplicate images)
 * - Hero image + checklist + CTA only — no "process" or "why jessup" bloat
 */
const fs = require('fs');
const path = require('path');

const SERVICES = [
  {
    file: 'service-commercial.html',
    gallery: ["img/work/commercial-01.jpg", "img/work/commercial-02.jpg", "img/work/commercial-03.jpg", "img/work/commercial-04.jpg", "img/work/commercial-05.jpg", "img/work/commercial-06.jpg", "img/work/commercial-07.jpg", "img/work/commercial-08.jpg", "img/work/commercial-09.jpg", "img/work/commercial-10.jpg", "img/work/commercial-11.jpg", "img/work/commercial-12.jpg"],
    title: 'Commercial Construction',
    meta: 'Commercial construction services in Central Louisiana. New construction, renovations, turnkey design-build for office, retail, and industrial properties.',
    hero: 'img/commercial-img-4.png',
    category: 'Construction',
    tagline: "Building Louisiana's Business Future",
    desc: 'We are a Native American owned General Contractor with licenses in Commercial and Residential Building Construction. From corporate office renovations to full-scale industrial builds, we deliver projects on time and within budget. Occupied and fully operational job sites are never a problem.',
    items: ['New commercial construction from ground up','Commercial building renovations and remodels','Turnkey design-build services','Industrial construction and warehousing','Welders and heavy equipment operators on staff','ISN certified — approved for corporate contractor requirements','Occupied, fully operational job sites welcome'],
  },
  {
    file: 'service-housing.html',
    gallery: ["img/work/housing-01.jpg", "img/work/housing-02.jpg", "img/work/housing-03.jpg", "img/work/housing-04.jpg", "img/work/housing-05.jpg", "img/work/housing-06.jpg", "img/work/housing-07.jpg", "img/work/housing-08.jpg", "img/work/housing-09.jpg", "img/work/housing-10.jpg", "img/work/housing-11.jpg", "img/work/housing-12.jpg"],
    title: 'Affordable Housing',
    meta: 'Affordable housing construction in Central Louisiana. Custom homes and modular housing built with quality materials within your budget.',
    hero: 'img/housing-home-5.jpg',
    category: 'Residential',
    tagline: "Quality Homes Within Your Budget",
    desc: 'Custom homes do not have to break the bank. Jessup Construction works with you to design and build a home you will love — using quality materials, within your budget. We are both designers and builders, collaborating directly with you from start to finish.',
    items: ['Custom home builds from ground up','Modular and manufactured housing options','Start-to-finish client collaboration','Budget-conscious material selection','Commercial and Residential Building licensed','Bonded and insured for your protection'],
  },
  {
    file: 'service-reno.html',
    gallery: ["img/work/reno-01.jpg", "img/work/reno-02.jpg", "img/work/reno-03.jpg", "img/work/reno-04.jpg", "img/work/reno-05.jpg", "img/work/reno-06.jpg", "img/work/reno-07.jpg", "img/work/reno-08.jpg", "img/work/reno-09.jpg", "img/work/reno-10.jpg", "img/work/reno-11.jpg", "img/work/reno-12.jpg", "img/work/reno-13.jpg", "img/work/reno-14.jpg"],
    title: 'Residential Renovations',
    meta: 'Residential renovation services in Central Louisiana. Kitchen, bathroom, outdoor patio, and whole-house renovations by Jessup Construction.',
    hero: 'img/reno-img-4.png',
    category: 'Renovation',
    tagline: "Transform Your Space",
    desc: 'From bathroom remodels to complete home transformations, Jessup Construction handles renovations of any scale. We collaborate with you and your designer to deliver exactly the result you envisioned — on budget and on time.',
    items: ['Kitchen and bathroom remodels','Whole-house renovations','Outdoor patio and living spaces','Interior renovations and build-outs','Design collaboration available','Occupied home renovations welcome'],
  },
  {
    file: 'service-concrete.html',
    gallery: ["img/work/concrete-01.jpg", "img/work/concrete-02.jpg", "img/work/concrete-03.jpg", "img/work/concrete-04.jpg", "img/work/concrete-05.jpg", "img/work/concrete-06.jpg", "img/work/concrete-07.jpg", "img/work/concrete-08.jpg", "img/work/concrete-09.jpg", "img/work/concrete-10.jpg"],
    title: 'Concrete',
    meta: 'Concrete construction services in Central Louisiana. Foundations, slabs, driveways, patios, and parking surfaces by Jessup Construction.',
    hero: 'img/concrete-img-7.png',
    category: 'Infrastructure',
    tagline: "The Most Durable Surface Available",
    desc: 'Concrete is the most durable surface available for driveways, foundations, parking lots, patios, and industrial floors. Jessup Construction has the crews and equipment to pour, finish, and deliver concrete work that lasts for generations.',
    items: ['Foundation and slab pours','Driveways and parking surfaces','Patios and outdoor surfaces','Industrial concrete floors','Retaining walls and curbing','Finishing and sealing services'],
  },
  {
    file: 'service-helical.html',
    gallery: ["img/work/helical-01.jpg", "img/work/helical-02.jpg"],
    title: 'Helical Piers',
    meta: 'Certified helical pier installation in Central Louisiana. Deep, load-bearing support for new construction, additions, decks, and porches by Jessup Construction.',
    hero: 'img/work/helical-01.jpg',
    category: 'Infrastructure',
    tagline: "Solid Support for New Construction",
    desc: "Jessup Construction now offers certified helical pier installation. Helical piers are steel shafts with screw-shaped plates that are driven deep into the ground until they reach stable, load-bearing soil — giving your structure a foundation that holds even where Central Louisiana's clay and wet soils shift. They are a strong choice for new construction, additions, decks, and porches.",
    items: ['Helical pier installation for new foundations','Support for slabs, additions, decks, and porches','Installation in soft, wet, or expansive Louisiana soils','Hydraulic installation with minimal excavation','Load-bearing capacity verified as each pier is installed'],
  },
  {
    file: 'service-asphalt.html',
    gallery: ["img/work/asphalt-01.jpg"],
    title: 'Asphalt Paving',
    meta: 'Asphalt paving services in Central Louisiana. Parking lots, driveways, and commercial paving by Jessup Construction.',
    hero: 'img/asphalt-paving-1.jpg',
    category: 'Infrastructure',
    tagline: "Smooth, Durable Paving Solutions",
    desc: 'Jessup Construction provides professional asphalt paving for parking lots, driveways, commercial properties, and large-scale paving projects throughout Central Louisiana. We handle everything from new pours to full resurfacing.',
    items: ['Commercial parking lot paving','Driveway paving and resurfacing','Large-scale paving projects','Crack sealing and patching','Line striping and marking','Grading and base preparation'],
  },
  {
    file: 'service-roofing.html',
    gallery: ["img/work/roofing-01.jpg", "img/work/roofing-02.jpg", "img/work/roofing-03.jpg", "img/work/roofing-04.jpg", "img/work/roofing-05.jpg"],
    title: 'Roofing',
    meta: 'Roofing services in Central Louisiana. Asphalt shingle and metal roofing for commercial and residential properties.',
    hero: 'img/roofing-1.png',
    category: 'Infrastructure',
    tagline: "Any Roof, Any Structure",
    desc: 'Commercial and residential roofing for any type of structure. Jessup Construction installs asphalt shingle and metal roofing systems built to withstand Central Louisiana weather. From simple repairs to complete new roof installations.',
    items: ['Asphalt shingle roofing','Metal roofing systems','Commercial flat roofing','Residential re-roofing','Storm damage roof repairs','New construction roofing'],
  },
  {
    file: 'service-drainage.html',
    gallery: ["img/work/drainage-01.jpg"],
    title: 'Drainage',
    meta: 'Drainage solutions in Central Louisiana. Grading, French drains, catch basins, and subsurface drainage by Jessup Construction.',
    hero: 'img/drainage-site-1.jpg',
    category: 'Infrastructure',
    tagline: "Water Management Solutions",
    desc: 'Proper drainage protects your property from erosion, flooding, and structural damage. Jessup Construction designs and installs drainage systems for residential, commercial, and industrial properties throughout Central Louisiana.',
    items: ['Land grading and leveling','French drain installation','Catch basins and inlets','Subsurface drainage systems','Storm water management','Site preparation and grading'],
  },
  {
    file: 'service-boathouse.html',
    gallery: ["img/work/boathouse-01.jpg", "img/work/boathouse-02.jpg", "img/work/boathouse-03.jpg", "img/work/boathouse-04.jpg", "img/work/boathouse-05.jpg", "img/work/boathouse-06.jpg", "img/work/boathouse-07.jpg", "img/work/boathouse-08.jpg", "img/work/boathouse-09.jpg", "img/work/boathouse-10.jpg", "img/work/boathouse-11.jpg", "img/work/boathouse-12.jpg", "img/work/boathouse-13.jpg", "img/work/boathouse-14.jpg"],
    title: 'Boathouse Construction',
    meta: 'Custom boathouse construction on Central Louisiana waterways. From standard builds to going all out with party decks.',
    hero: 'img/work/boathouse-11.jpg',
    category: 'Waterfront',
    tagline: "Custom Waterfront Structures",
    desc: 'Jessup Construction builds custom boathouses on all Central Louisiana waterways — from standard boathouses to "going all out" party deck builds. We understand the unique requirements of waterfront construction and deliver structures built to last.',
    items: ['Standard boathouse builds','Party deck boathouses','Covered boat lifts','Waterfront decking','Dock and pier construction','Custom waterfront structures'],
  },
  {
    file: 'service-seawalls.html',
    gallery: ["img/work/seawalls-01.jpg", "img/work/seawalls-02.jpg", "img/work/seawalls-03.jpg", "img/work/seawalls-04.jpg", "img/work/seawalls-05.jpg", "img/work/seawalls-06.jpg"],
    title: 'Seawalls',
    meta: 'Seawall construction and shoreline protection in Central Louisiana. Pneumatically driven pylons and custom anchoring.',
    hero: 'img/work/seawalls-01.jpg',
    category: 'Waterfront',
    tagline: "Shoreline Protection That Lasts",
    desc: 'Protect your shoreline from erosion with a custom-engineered seawall from Jessup Construction. We serve all Central Louisiana waterways with seawall construction, repair, and shoreline stabilization solutions.',
    items: ['New seawall construction','Shoreline erosion protection','Bulkhead installation','Seawall repair and restoration','Bank stabilization','Custom anchoring systems'],
  },
  {
    file: 'service-fencing.html',
    gallery: ["img/work/fencing-01.jpg", "img/work/fencing-02.jpg", "img/work/fencing-03.jpg", "img/work/fencing-05.jpg", "img/work/fencing-06.jpg", "img/work/fencing-07.jpg", "img/work/fencing-08.jpg"],
    title: 'Privacy Fencing',
    meta: 'Custom privacy fencing in Central Louisiana. Wood, ornate gates, and custom fencing by Jessup Construction.',
    hero: 'img/fencing-img-3.png',
    category: 'Specialty',
    tagline: "Custom Privacy Solutions",
    desc: 'Jessup Construction builds custom privacy fencing for residential and commercial properties. We collaborate with you on design to deliver fencing that matches your style and enhances your property.',
    items: ['Wood privacy fencing','Custom gate design and installation','Ornamental and decorative fencing','Commercial security fencing','Pool and yard enclosures','Post installation and finishing'],
  },
  {
    file: 'service-plans.html',
    gallery: ["img/work/plans-01.jpg", "img/work/plans-02.jpg", "img/work/plans-03.jpg", "img/work/plans-04.jpg"],
    title: 'Plan Development & Drafting',
    meta: 'Construction plan development and drafting in Central Louisiana. Blueprints, floor plans, and permitting prep by Jessup Construction.',
    hero: 'img/work/plans-01.jpg',
    category: 'Planning',
    tagline: "From Concept to Construction-Ready",
    desc: 'Jessup Construction can plan, manage, and build multi-phase projects as required. We develop construction-ready blueprints, detailed floor plans, and permitting documentation so your project starts on solid footing.',
    items: ['Construction-ready blueprints','Floor plan development','Permitting documentation prep','Multi-phase project planning','Design-build collaboration','Site planning and layout'],
  },
  {
    file: 'service-storm.html',
    gallery: ["img/work/storm-01.jpg", "img/work/storm-02.jpg", "img/work/storm-03.jpg", "img/work/storm-04.jpg", "img/work/storm-05.jpg"],
    title: 'Storm Damage',
    meta: 'Storm damage repair and restoration in Central Louisiana. Water, mold, and smoke damage restoration by Jessup Construction.',
    hero: 'img/disaster-img-6.png',
    category: 'Emergency',
    tagline: "Fast Response. Complete Restoration.",
    desc: 'Jessup Construction is an experienced leader in Central Louisiana storm damage restoration. Water, mildew, mold, and smoke damage — we respond fast and restore completely. Federally Certified National Contractor for Storm Disaster and Relief.',
    items: ['Water damage restoration','Mold and mildew remediation','Smoke and fire damage repair','Roof storm damage repair','Structural restoration','24/7 emergency response'],
    emergency: true,
  },
  {
    file: 'service-disaster.html',
    gallery: ["img/work/disaster-01.jpg", "img/work/disaster-02.jpg", "img/work/disaster-04.jpg"],
    title: 'Disaster Relief',
    meta: 'Federal disaster relief contractor in Central Louisiana. CAGE Code certified for storm debris removal and emergency rebuilding.',
    hero: 'img/disaster-relief-1.jpg',
    category: 'Emergency',
    tagline: "Federally Certified. Ready to Respond.",
    desc: 'Jessup Construction is a Federally Certified National Contractor for Disaster Relief — CAGE Code certified. When disaster strikes communities across Central Louisiana, we provide immediate response, debris removal, emergency housing, and permanent rebuilding solutions.',
    items: ['Storm debris removal','Emergency housing solutions','Travel trailers and temporary structures','Permanent rebuilding and restoration','Federal disaster relief programs','CAGE Code certified contractor'],
    emergency: true,
  },
];

const NAV = `<nav id="site-nav" class="solid" role="navigation">
  <div class="nav-main"><div class="container"><div class="nav-main-inner">
    <a href="index.html" class="nav-logo"><img src="img/logo.png" alt="Jessup Construction" onerror="this.style.display='none'"></a>
    <ul class="nav-links">
      <li><a href="index.html" class="nav-link">Home</a></li>
      <li><a href="about.html" class="nav-link">About</a></li>
      <li class="nav-item-services"><span class="nav-link nav-services-trigger">Services <span class="chevron">▾</span></span>
        <div class="mega-menu">
          <div class="mega-menu-header"><span class="mega-menu-title">Our Services</span></div>
          <div class="mega-menu-grid">
            <div>
              <div class="mega-col-title">Construction</div>
              <a href="service-commercial.html" class="mega-menu-item">Commercial Construction</a>
              <a href="service-housing.html" class="mega-menu-item">Affordable Housing</a>
              <a href="service-reno.html" class="mega-menu-item">Residential Renovations</a>
              <div class="mega-col-title" style="margin-top:var(--space-4)">Infrastructure</div>
              <a href="service-concrete.html" class="mega-menu-item">Concrete</a>
              <a href="service-helical.html" class="mega-menu-item">Helical Piers</a>
              <a href="service-asphalt.html" class="mega-menu-item">Asphalt Paving</a>
              <a href="service-roofing.html" class="mega-menu-item">Roofing</a>
              <a href="service-plans.html" class="mega-menu-item">Plan Development &amp; Drafting</a>
            </div>
            <div>
              <div class="mega-col-title">Specialty</div>
              <a href="service-boathouse.html" class="mega-menu-item">Boathouse Construction</a>
              <a href="service-seawalls.html" class="mega-menu-item">Seawalls</a>
              <a href="service-fencing.html" class="mega-menu-item">Privacy Fencing</a>
              <a href="service-drainage.html" class="mega-menu-item">Drainage</a>
              <div class="mega-col-title" style="margin-top:var(--space-4)">Emergency</div>
              <a href="service-storm.html" class="mega-menu-item emergency">Storm Damage</a>
              <a href="service-disaster.html" class="mega-menu-item emergency">Disaster Relief</a>
            </div>
          </div>
          <div class="mega-menu-cta"><a href="quote.html" class="btn btn-primary" style="width:100%;justify-content:center">Get Free Quote &rarr;</a></div>
        </div>
      </li>
      <li><a href="projects.html" class="nav-link">Projects</a></li>
      <li><a href="careers.html" class="nav-link">Careers</a></li>
      <li><a href="contact.html" class="nav-link">Contact</a></li>
    </ul>
    <a href="quote.html" class="nav-cta">Get Quote</a>
    <button id="nav-hamburger" class="nav-hamburger" aria-label="Open menu"><span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span></button>
  </div></div></div>
</nav>
<div id="mobile-overlay" class="mobile-overlay">
  <div class="mobile-header"><img src="img/logo.png" alt="Jessup" style="height:44px" onerror="this.style.display='none'"><button id="mobile-close" class="mobile-close">&#x2715;</button></div>
  <nav class="mobile-nav-links">
    <a href="index.html" class="mobile-nav-link">Home</a>
    <a href="about.html" class="mobile-nav-link">About Us</a>
    <div class="mobile-nav-link mobile-nav-services-toggle" id="mobile-services-toggle"><span>Services</span><span class="toggle-icon">+</span></div>
    <div id="mobile-services-list" class="mobile-services-list">
      <a href="service-commercial.html" class="mobile-service-link">Commercial Construction</a>
      <a href="service-housing.html" class="mobile-service-link">Affordable Housing</a>
      <a href="service-reno.html" class="mobile-service-link">Residential Renovations</a>
      <a href="service-concrete.html" class="mobile-service-link">Concrete</a>
      <a href="service-helical.html" class="mobile-service-link">Helical Piers</a>
      <a href="service-asphalt.html" class="mobile-service-link">Asphalt Paving</a>
      <a href="service-roofing.html" class="mobile-service-link">Roofing</a>
      <a href="service-boathouse.html" class="mobile-service-link">Boathouse Construction</a>
      <a href="service-seawalls.html" class="mobile-service-link">Seawalls</a>
      <a href="service-fencing.html" class="mobile-service-link">Privacy Fencing</a>
      <a href="service-drainage.html" class="mobile-service-link">Drainage</a>
      <a href="service-storm.html" class="mobile-service-link">Storm Damage</a>
      <a href="service-disaster.html" class="mobile-service-link">Disaster Relief</a>
      <a href="service-plans.html" class="mobile-service-link">Plan Development &amp; Drafting</a>
    </div>
    <a href="projects.html" class="mobile-nav-link">Projects</a>
    <a href="careers.html" class="mobile-nav-link">Careers</a>
    <a href="contact.html" class="mobile-nav-link">Contact</a>
  </nav>
  <div class="mobile-footer"><a href="tel:+13182296204" class="mobile-phone">&#128222; (318) 229-6204</a><a href="quote.html" class="btn btn-primary" style="width:100%;justify-content:center">Get Free Quote</a></div>
</div>`;

const FOOTER = `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div><img src="img/logo.png" alt="Jessup Construction" class="footer-brand-logo" onerror="this.style.display='none'"><p class="footer-brand-desc">Native American owned general contractor serving Central Louisiana for 30+ years.</p><div class="footer-social"><a href="https://www.facebook.com/jessupconstruction/" target="_blank" rel="noopener noreferrer" class="footer-social-link">f</a></div></div>
      <div><h4 class="footer-col-title">Services</h4><ul class="footer-links"><li><a href="service-commercial.html" class="footer-link">&#9658; Commercial Construction</a></li><li><a href="service-concrete.html" class="footer-link">&#9658; Concrete</a></li><li><a href="service-seawalls.html" class="footer-link">&#9658; Seawalls</a></li><li><a href="service-disaster.html" class="footer-link" style="color:var(--safety-yellow)">&#9658; Disaster Relief</a></li></ul></div>
      <div><h4 class="footer-col-title">Company</h4><ul class="footer-links"><li><a href="index.html" class="footer-link">&#9658; Home</a></li><li><a href="about.html" class="footer-link">&#9658; About Us</a></li><li><a href="projects.html" class="footer-link">&#9658; Projects</a></li><li><a href="quote.html" class="footer-link">&#9658; Get a Quote</a></li></ul></div>
      <div><h4 class="footer-col-title">Contact</h4><div class="footer-contact-item"><span class="footer-contact-icon">&#128222;</span><a href="tel:+13182296204">(318) 229-6204</a></div><div class="footer-contact-item"><span class="footer-contact-icon">&#128231;</span><a href="mailto:kimberly@jessupconstruct.com">kimberly@jessupconstruct.com</a></div><div class="footer-contact-item"><span class="footer-contact-icon">&#128205;</span><div>3306 LA-28 Suite E<br>Pineville, LA 71360</div></div></div>
    </div>
    <div class="footer-bottom"><p class="footer-copy">&copy; 2024 Jessup Construction. All rights reserved.</p><p class="footer-native">&#129476; Native American Owned Business</p></div>
  </div>
</footer>`;

for (const svc of SERVICES) {
  const accentColor = svc.emergency ? 'var(--safety-yellow)' : 'var(--safety-orange)';
  const ctaColor = svc.emergency ? 'btn-emergency' : 'btn-primary';
  const checkItems = svc.items.map(i =>
    `<div class="check-item"><div class="check-icon" style="border-color:${accentColor};color:${accentColor};">&#10003;</div><span>${i}</span></div>`
  ).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${svc.title} | Jessup Construction — Central Louisiana</title>
  <meta name="description" content="${svc.meta}">
  <link rel="icon" type="image/png" href="img/logo.png">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

${NAV}

<main id="main">

<!-- HERO -->
<section style="position:relative;min-height:68vh;display:flex;align-items:flex-end;overflow:hidden;padding-top:130px;border-bottom:6px solid var(--brand-yellow);" aria-label="${svc.title} hero">
  <img src="${svc.hero}" alt="${svc.title} — Jessup Construction"
       style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;" loading="eager">
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.5) 55%,rgba(0,0,0,0.15) 100%);z-index:1;"></div>
  <div class="container" style="position:relative;z-index:2;padding-bottom:var(--space-14);">
    <p style="font-family:var(--font-mono);font-size:var(--text-micro);letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--steel-mid);margin-bottom:var(--space-3);">
      <a href="index.html" style="color:var(--steel-mid);">Home</a> &rsaquo;
      <a href="services.html" style="color:var(--steel-mid);">Services</a> &rsaquo;
      ${svc.title}
    </p>
    <p class="label" style="margin-bottom:var(--space-2);color:${accentColor};">${svc.category}</p>
    <h1 style="font-family:var(--font-display);font-size:var(--text-h1);letter-spacing:var(--tracking-tight);color:var(--concrete-white);margin-bottom:var(--space-2);">${svc.title.toUpperCase()}</h1>
    <p style="font-family:var(--font-heading);font-size:var(--text-large);color:${accentColor};margin-bottom:var(--space-6);">${svc.tagline}</p>
    <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;">
      <a href="quote.html" class="btn ${ctaColor}">Get Free Quote</a>
      <a href="tel:+13182296204" class="btn btn-outline">&#128222; (318) 229-6204</a>
    </div>
  </div>
</section>

<!-- CONTENT -->
<section class="section-pad section-dark" aria-label="${svc.title} details">
  <div class="container">
    <div class="grid-2" style="gap:var(--space-12);align-items:start;">
      <div class="scroll-reveal">
        <p class="label" style="margin-bottom:var(--space-3);">Overview</p>
        <div class="rebar-line"></div>
        <h2 class="section-title" style="font-size:var(--text-h2);margin-bottom:var(--space-6);">${svc.tagline}</h2>
        <p style="color:var(--concrete-mid);line-height:var(--leading-normal);margin-bottom:var(--space-8);">${svc.desc}</p>
        <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;">
          <a href="quote.html" class="btn ${ctaColor}">Request Free Quote &rarr;</a>
          <a href="tel:+13182296204" class="btn btn-outline">&#128222; Call Now</a>
        </div>
      </div>
      <div class="scroll-reveal" data-delay="1">
        <p style="font-family:var(--font-heading);font-size:var(--text-small);font-weight:700;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--concrete-white);margin-bottom:var(--space-6);">What's Included</p>
        <div class="check-list">
${checkItems}
        </div>
      </div>
    </div>
  </div>
</section>

${svc.gallery && svc.gallery.length ? `<!-- OUR WORK -->
<section class="section-pad" style="background:#111;" aria-label="${svc.title} project photos">
  <div class="container">
    <div class="scroll-reveal" style="margin-bottom:var(--space-8);">
      <p class="label">Our Work</p>
      <h2 class="section-title" style="font-size:var(--text-h2);margin-top:var(--space-3);">${svc.title} by Jessup</h2>
    </div>
    <div class="work-gallery">
${svc.gallery.map((src, i) => `      <figure class="gallery-item"><img src="${src}" alt="${svc.title} project by Jessup Construction, photo ${i + 1}" loading="lazy"></figure>`).join('\n')}
    </div>
  </div>
</section>
` : ''}
<!-- CTA -->
<section class="section-pad" style="background:var(--concrete-deep);text-align:center;" aria-label="Get a quote">
  <div class="container">
    <div class="scroll-reveal">
      <p class="label">Ready to Start?</p>
      <div class="rebar-line" style="margin:var(--space-4) auto;"></div>
      <h2 class="section-title" style="margin-bottom:var(--space-4);">Get Your Free Quote</h2>
      <p style="color:var(--concrete-mid);max-width:500px;margin:0 auto var(--space-6);">Licensed, bonded, and insured. Contact us to discuss your project — we respond promptly.</p>
      <div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap;">
        <a href="quote.html" class="btn ${ctaColor}">Request Free Quote</a>
        <a href="tel:+13182296204" class="btn btn-outline">&#128222; (318) 229-6204</a>
      </div>
    </div>
  </div>
</section>

</main>

${FOOTER}
<button id="scroll-top" class="scroll-top">&#8593;</button>
<div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
  <button id="lightbox-close" class="lightbox-close" aria-label="Close">&#10005;</button>
  <img id="lightbox-img" class="lightbox-img" src="" alt="">
</div>
<script src="main.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, svc.file), html, 'utf8');
  const lines = html.split('\n').length;
  console.log(`✅ ${svc.file.padEnd(28)} ${lines} lines`);
}

console.log('\nDone — all 13 service pages regenerated.');
