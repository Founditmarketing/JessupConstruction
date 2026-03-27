#!/usr/bin/env node
// Generate all 13 service pages for Jessup Construction

const fs = require('fs');
const path = require('path');

const NAV = `
<nav id="site-nav" class="solid" role="navigation">
  <div class="nav-main">
    <div class="container">
      <div class="nav-main-inner">
        <a href="index.html" class="nav-logo"><img src="https://jessupconstruct.com/wp-content/uploads/2021/10/Untitled-design-71.png" alt="Jessup Construction" onerror="this.style.display='none'"></a>
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
      </div>
    </div>
  </div>
</nav>
<div id="mobile-overlay" class="mobile-overlay">
  <div class="mobile-header"><img src="https://jessupconstruct.com/wp-content/uploads/2021/10/Untitled-design-71.png" alt="Jessup" style="height:44px" onerror="this.style.display='none'"><button id="mobile-close" class="mobile-close">&#x2715;</button></div>
  <nav class="mobile-nav-links">
    <a href="index.html" class="mobile-nav-link">Home</a>
    <a href="about.html" class="mobile-nav-link">About Us</a>
    <div class="mobile-nav-link mobile-nav-services-toggle" id="mobile-services-toggle"><span>Services</span><span class="toggle-icon">+</span></div>
    <div id="mobile-services-list" class="mobile-services-list">
      <a href="service-commercial.html" class="mobile-service-link">Commercial Construction</a>
      <a href="service-housing.html" class="mobile-service-link">Affordable Housing</a>
      <a href="service-reno.html" class="mobile-service-link">Residential Renovations</a>
      <a href="service-concrete.html" class="mobile-service-link">Concrete</a>
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
</div>
`;

const FOOTER = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div><img src="https://jessupconstruct.com/wp-content/uploads/2021/10/Untitled-design-71.png" alt="Jessup Construction" class="footer-brand-logo" onerror="this.style.display='none'"><p class="footer-brand-desc">Native American owned general contractor serving Central Louisiana for 30+ years.</p><div class="footer-social"><a href="https://www.facebook.com/jessupconstruction/" target="_blank" rel="noopener noreferrer" class="footer-social-link">f</a></div></div>
      <div><h4 class="footer-col-title">Services</h4><ul class="footer-links"><li><a href="service-commercial.html" class="footer-link">&#9658; Commercial Construction</a></li><li><a href="service-concrete.html" class="footer-link">&#9658; Concrete</a></li><li><a href="service-seawalls.html" class="footer-link">&#9658; Seawalls</a></li><li><a href="service-disaster.html" class="footer-link" style="color:var(--safety-yellow)">&#9658; Disaster Relief</a></li></ul></div>
      <div><h4 class="footer-col-title">Company</h4><ul class="footer-links"><li><a href="index.html" class="footer-link">&#9658; Home</a></li><li><a href="about.html" class="footer-link">&#9658; About Us</a></li><li><a href="projects.html" class="footer-link">&#9658; Projects</a></li><li><a href="quote.html" class="footer-link">&#9658; Get a Quote</a></li></ul></div>
      <div><h4 class="footer-col-title">Contact</h4><div class="footer-contact-item"><span class="footer-contact-icon">&#128222;</span><a href="tel:+13182296204">(318) 229-6204</a></div><div class="footer-contact-item"><span class="footer-contact-icon">&#128231;</span><a href="mailto:kimberly@jessupconstruct.com">kimberly@jessupconstruct.com</a></div><div class="footer-contact-item"><span class="footer-contact-icon">&#128205;</span><div>3306 LA-28 Suite E<br>Pineville, LA 71360</div></div></div>
    </div>
    <div class="footer-bottom"><p class="footer-copy">&copy; 2024 Jessup Construction. All rights reserved.</p><p class="footer-native">&#129476; Native American Owned Business</p></div>
  </div>
</footer>
<button id="scroll-top" class="scroll-top">&#8593;</button>
<script src="main.js"></script>
`;

const services = [
  {
    file: 'service-commercial.html',
    title: 'Commercial Construction',
    tagline: 'Building Louisiana\'s Business Future',
    metaDesc: 'Commercial construction services in Central Louisiana. New construction, renovations, turnkey design-build for office, retail, and industrial properties.',
    heroImg: 'https://jessupconstruct.com/wp-content/uploads/2025/07/Jessup-Construction-3.png',
    heroFallback: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    category: 'Construction',
    intro: 'From corporate office renovations to full-scale industrial builds, Jessup Construction delivers commercial projects on time, on budget, and built to last. We bring 30+ years of experience to every commercial project in Central Louisiana.',
    bullets: [
      'New commercial construction from ground up',
      'Commercial building renovations and remodels',
      'Turnkey design-build services',
      'Building transformations and tenant improvements',
      'Industrial construction and warehousing',
      'Welders and heavy equipment operators on staff',
      'ISN certified for corporate contractor requirements'
    ],
    process: [
      { num: '01', title: 'Consultation', desc: 'We meet with you to understand your project scope, timeline, and budget requirements.' },
      { num: '02', title: 'Planning & Design', desc: 'Our team develops construction-ready plans and detailed cost estimates.' },
      { num: '03', title: 'Construction', desc: 'Qualified crews execute the build with precision, quality, and communication throughout.' },
      { num: '04', title: 'Final Walkthrough', desc: 'We walk through every detail to ensure your complete satisfaction before handoff.' }
    ]
  },
  {
    file: 'service-housing.html',
    title: 'Affordable Housing',
    tagline: 'Your Dream Home, Within Reach',
    metaDesc: 'Affordable housing construction in Central Louisiana. Custom homes, mobile homes, and modular homes built with quality materials within your budget.',
    heroImg: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80',
    category: 'Residential',
    intro: 'Custom homes don\'t have to break the bank. Jessup Construction works with you to design and build a home you\'ll love — using quality materials, within your budget. We are both designers and builders, collaborating directly with you from start to finish.',
    bullets: [
      'Custom home design and build',
      'Collaboration on design, values, and budget',
      'Quality materials at affordable price points',
      'Renovation and expansion options',
      'Mobile home and modular home alternatives',
      'New construction and spec homes',
      'Energy-efficient building options'
    ],
    process: [
      { num: '01', title: 'Design Consultation', desc: 'We sit down with you and your family to understand your vision, needs, and budget.' },
      { num: '02', title: 'Blueprint & Budget', desc: 'Our drafting team creates your floor plan and we finalize a detailed budget.' },
      { num: '03', title: 'Construction', desc: 'Quality construction with regular updates and site access for you throughout.' },
      { num: '04', title: 'Move-In Ready', desc: 'Final walkthrough, punch list completion, and keys in hand.' }
    ]
  },
  {
    file: 'service-reno.html',
    title: 'Residential Renovations',
    tagline: 'Transform Your Living Space',
    metaDesc: 'Residential renovation services in Central Louisiana. Kitchen, bathroom, outdoor patio, and whole-house renovations designed around your wishes.',
    heroImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    category: 'Renovation',
    intro: 'Your home renovation is designed with your wishes in mind. We collaborate closely with you to bring your vision to life — whether you\'re redoing a single bathroom or transforming your entire home. Elegant to modern, we build it right.',
    bullets: [
      'Kitchen renovations — full redesign and remodel',
      'Bathroom upgrades — modern or elegant styling',
      'Outdoor patio and outdoor kitchen construction',
      'Whole-house renovations and restorations',
      'New addition and room expansion',
      'Client collaboration on every design decision',
      'New construction homes also available'
    ],
    process: [
      { num: '01', title: 'Design Meeting', desc: 'We learn your style, needs, and budget to craft a renovation plan you\'ll love.' },
      { num: '02', title: 'Material Selection', desc: 'Choose your finishes, fixtures, and materials with our guidance.' },
      { num: '03', title: 'Renovation', desc: 'Minimal disruption to your daily life while we transform your space.' },
      { num: '04', title: 'Reveal', desc: 'Final walkthrough of your beautifully renovated home.' }
    ]
  },
  {
    file: 'service-concrete.html',
    title: 'Concrete',
    tagline: 'The Most Durable Surface Available',
    metaDesc: 'Professional concrete services in Central Louisiana. Foundations, slabs, driveways, parking lots, patios, steps, and more. Residential and commercial.',
    heroImg: 'https://jessupconstruct.com/wp-content/uploads/2021/11/118070492_758571381352695_1545159837514360320_n.jpg',
    heroFallback: 'https://images.unsplash.com/photo-1597762117709-859f744b84c3?w=1200&q=80',
    category: 'Infrastructure',
    intro: 'Concrete is the foundation of every great structure. Jessup Construction pours engineered structural foundations and surfaces that are built to last decades. Residential and commercial concrete work across Central Louisiana.',
    bullets: [
      'Engineered structural foundations',
      'Slab on grade construction',
      'Sidewalks, walkways, and pathways',
      'Parking surfaces and lots',
      'Driveways — residential and commercial',
      'Steps, patios, and pool decks',
      'Concrete restoration and resurfacing',
      'Decorative patterns and colors available'
    ],
    process: [
      { num: '01', title: 'Site Prep', desc: 'Grading, forming, and sub-base preparation for a flawless pour.' },
      { num: '02', title: 'Reinforcement', desc: 'Rebar and wire mesh installed to engineer specifications.' },
      { num: '03', title: 'Pour & Finish', desc: 'High-quality concrete mixed and finished to your spec.' },
      { num: '04', title: 'Cure & Seal', desc: 'Proper curing and sealing for maximum longevity.' }
    ]
  },
  {
    file: 'service-asphalt.html',
    title: 'Asphalt Paving',
    tagline: 'Large-Scale Paving Built to Last',
    metaDesc: 'Professional asphalt paving services in Central Louisiana. Parking lot resurfacing, driveways, industrial highways. Budget and time specifications met.',
    heroImg: 'https://images.unsplash.com/photo-1546213290-e1b492ab3eee?w=1200&q=80',
    category: 'Infrastructure',
    intro: 'From parking lot resurfacing to industrial facility highways, Jessup Construction tackles large-scale asphalt paving projects with precision. Every project meets your budget, timeline, specifications, and geotechnical criteria.',
    bullets: [
      'Large-scale commercial paving projects',
      'Parking lot installation and resurfacing',
      'Industrial facility roadways and access roads',
      'Driveway installation and repair',
      'Budget, time, and spec management',
      'Geotechnical criteria compliance',
      'Striping and markings available'
    ],
    process: [
      { num: '01', title: 'Assessment', desc: 'Site evaluation and geotechnical review before we begin any work.' },
      { num: '02', title: 'Sub-Base', desc: 'Proper grading and base compaction — the key to a long-lasting surface.' },
      { num: '03', title: 'Paving', desc: 'Hot mix asphalt applied and compacted by our experienced crew.' },
      { num: '04', title: 'Striping', desc: 'Line marking, signage, and final inspection.' }
    ]
  },
  {
    file: 'service-roofing.html',
    title: 'Roofing',
    tagline: 'Any Roof, Any Structure',
    metaDesc: 'Commercial and residential roofing services in Central Louisiana. Asphalt shingle and metal roofing. New installation and replacement.',
    heroImg: 'https://images.unsplash.com/photo-1632236542346-d2e56d5a3ce0?w=1200&q=80',
    category: 'Infrastructure',
    intro: 'Jessup Construction installs and replaces roofing on any type of structure — commercial or residential. We work with asphalt shingle and metal roofing systems, delivering a quality roof that protects your investment for decades.',
    bullets: [
      'Commercial roof installation and replacement',
      'Residential roofing — all styles',
      'Asphalt shingle roofing systems',
      'Metal roofing — standing seam and panel',
      'Roof repair and emergency patching',
      'Flat roof and low-slope systems',
      'Storm damage roof repair'
    ],
    process: [
      { num: '01', title: 'Inspection', desc: 'Complete roof inspection and damage assessment.' },
      { num: '02', title: 'Material Selection', desc: 'Choose from asphalt shingle, metal, or specialty roofing materials.' },
      { num: '03', title: 'Installation', desc: 'Professional installation with manufacturer-compliant techniques.' },
      { num: '04', title: 'Final Inspection', desc: 'Thorough inspection and cleanup. Your roof is ready to last.' }
    ]
  },
  {
    file: 'service-boathouse.html',
    title: 'Boathouse Construction',
    tagline: 'Custom Waterfront Builds on Every Louisiana Waterway',
    metaDesc: 'Custom boathouse construction in Central Louisiana. Standard to luxury party deck boathouses built on the Cane River, Red River, Kincaid Lake, and all waterways.',
    heroImg: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&q=80',
    category: 'Waterfront',
    intro: 'From functional boat shelters to spectacular party deck boathouses, Jessup Construction designs and builds custom waterfront structures that exceed expectations. We travel to all Central Louisiana waterways — no body of water is too far.',
    bullets: [
      'Standard boathouse construction',
      'Luxury party deck boathouses',
      'Custom design to meet your vision',
      'All Central Louisiana waterways',
      'Cane River, Red River, Kincaid Lake, and more',
      'Boat slip and lift systems',
      'Deck and entertaining area construction'
    ],
    process: [
      { num: '01', title: 'Site Visit', desc: 'We visit your waterfront to assess site conditions and discuss your vision.' },
      { num: '02', title: 'Design', desc: 'Custom boathouse design tailored to your property and aspirations.' },
      { num: '03', title: 'Permitting', desc: 'We handle required waterfront permits and regulatory approvals.' },
      { num: '04', title: 'Construction', desc: 'Quality waterfront build delivered to your exacting standards.' }
    ]
  },
  {
    file: 'service-seawalls.html',
    title: 'Seawalls',
    tagline: 'Protecting Your Shoreline for Generations',
    metaDesc: 'Professional seawall construction in Central Louisiana. Pneumatically driven pylons, shoreline protection, and sub-surface drainage. Long-lasting erosion control.',
    heroImg: 'https://jessupconstruct.com/wp-content/uploads/2021/11/117729851_758571411352692_4713175494221834088_n.jpg',
    heroFallback: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&q=80',
    category: 'Waterfront',
    intro: 'A properly constructed seawall is the most effective barrier against water invasion and shoreline erosion. Jessup Construction builds long-lasting seawalls using pneumatically driven pylons and custom anchoring systems — delivering an attractive, functional finished look.',
    bullets: [
      'Shoreline erosion prevention and protection',
      'Pneumatically driven pylon installation',
      'Custom anchoring system design',
      'Sub-surface drainage integration',
      'Water invasion barrier construction',
      'Attractive, finished appearance',
      'Residential and commercial waterfront'
    ],
    process: [
      { num: '01', title: 'Site Assessment', desc: 'We evaluate your shoreline erosion, water levels, and soil conditions.' },
      { num: '02', title: 'Engineering', desc: 'Custom seawall design engineered for your specific waterway.' },
      { num: '03', title: 'Pylon Installation', desc: 'Pneumatically driven pylons installed with custom anchoring systems.' },
      { num: '04', title: 'Finishing', desc: 'Drainage integration and attractive finish that enhances your property.' }
    ],
    videos: [
      { src: 'https://jessupconstruct.com/wp-content/uploads/2021/12/Jessup-Sea-Wall-Promo-v01.mov', label: 'Seawall Promo' },
      { src: 'https://jessupconstruct.com/wp-content/uploads/2022/02/Jessup-Sea-Wall-Combined.mp4', label: 'Seawall Combined' }
    ]
  },
  {
    file: 'service-fencing.html',
    title: 'Privacy Fencing',
    tagline: 'Security, Style, and Sanctuary',
    metaDesc: 'Custom privacy fencing in Central Louisiana. Ornate gates with iron inlays, decorative post coverings, and unique designs. Security and beauty combined.',
    heroImg: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1200&q=80',
    category: 'Specialty',
    intro: 'Privacy fencing provides both security and a personal sanctuary for your property. Jessup Construction designs and builds custom privacy fences that combine function with beauty — adding curb appeal and real estate value to your home.',
    bullets: [
      'Custom privacy fence design and build',
      'Decorative caps and triple trim options',
      'Ornate gates with iron inlays',
      'Decorative post coverings',
      'Security fencing for properties',
      'Unique designs tailored to your property',
      'Commercial and residential fencing'
    ],
    process: [
      { num: '01', title: 'Design Consultation', desc: 'We discuss your security needs, style preferences, and budget.' },
      { num: '02', title: 'Material Selection', desc: 'Choose your wood species, hardware style, and gate design.' },
      { num: '03', title: 'Installation', desc: 'Posts set in concrete, panels installed, gates hung and adjusted.' },
      { num: '04', title: 'Finishing', desc: 'Caps, trim, and any decorative elements installed to perfection.' }
    ]
  },
  {
    file: 'service-drainage.html',
    title: 'Drainage',
    tagline: 'Keep Water Where It Belongs',
    metaDesc: 'Professional drainage solutions in Central Louisiana. Grading, French drains, catch basins, subsurface piping, and land leveling to prevent water damage.',
    heroImg: 'https://jessupconstruct.com/wp-content/uploads/2021/11/117764678_758571464686020_2796105027315377357_n.jpg',
    heroFallback: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
    category: 'Infrastructure',
    intro: 'Standing water is the enemy of every property. Jessup Construction\'s drainage solutions direct water away from your structure and prevent costly erosion and flooding damage. From simple grading to complex subsurface systems, we solve water problems.',
    bullets: [
      'Land grading and leveling',
      'Subsurface piping and drainage',
      'French drain installation',
      'Catch basins and outflow systems',
      'Water pooling prevention near structures',
      'Erosion control solutions',
      'Residential and commercial drainage'
    ],
    process: [
      { num: '01', title: 'Site Evaluation', desc: 'We assess your property\'s water flow patterns and problem areas.' },
      { num: '02', title: 'Drainage Plan', desc: 'Custom drainage solution designed for your specific conditions.' },
      { num: '03', title: 'Installation', desc: 'Grading, trenching, and system installation by our experienced crew.' },
      { num: '04', title: 'Test & Verify', desc: 'We verify drainage performance and clean up the site completely.' }
    ]
  },
  {
    file: 'service-storm.html',
    title: 'Storm Damage Restoration',
    tagline: 'Fast Response. Expert Restoration.',
    metaDesc: 'Storm damage restoration in Central Louisiana. Water, mold, mildew, and smoke damage. Fast response from experienced storms specialists.',
    heroImg: 'https://images.unsplash.com/photo-1523576568769-9ddcfbfa0e14?w=1200&q=80',
    category: 'Emergency',
    isEmergency: true,
    intro: 'When storms hit Central Louisiana, Jessup Construction is the trusted leader in damage restoration. We respond fast with experienced crews to assess damage, mitigate further loss, and restore your property to pre-storm condition — or better.',
    bullets: [
      'Water intrusion damage repair',
      'Mildew and mold remediation',
      'Smoke and fire damage restoration',
      'Emergency tarping and board-up',
      'Roof repair and replacement',
      'Structural repair and reconstruction',
      'Fast, cost-effective solutions'
    ],
    process: [
      { num: '01', title: 'Emergency Response', desc: 'We respond immediately to assess damage and prevent further loss.' },
      { num: '02', title: 'Damage Assessment', desc: 'Thorough documentation of all storm damage for insurance purposes.' },
      { num: '03', title: 'Mitigation', desc: 'Emergency repairs to prevent additional damage while work is planned.' },
      { num: '04', title: 'Full Restoration', desc: 'Complete restoration of your property to pre-storm condition.' }
    ]
  },
  {
    file: 'service-disaster.html',
    title: 'Disaster Relief',
    tagline: 'Federally Certified National Contractor',
    metaDesc: 'Federal disaster relief contractor in Louisiana. CAGE Code certified. Storm debris removal, emergency housing, and permanent rebuilding after major disasters.',
    heroImg: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=1200&q=80',
    category: 'Emergency',
    isEmergency: true,
    intro: 'Jessup Construction is a Federally Certified National Contractor for Storm Disaster and Relief, holding an active CAGE Code. We deploy innovative technology and flexible, cost-effective strategies to restore communities after major disaster events.',
    bullets: [
      'CAGE Code certified federal contractor',
      'Storm debris collection and management',
      'Emergency housing — travel trailers, FEMA/HUD',
      'Mobile and modular home placement',
      'Fast neighborhood cleanup operations',
      'Permanent housing rebuilding',
      'Multi-phase disaster recovery management'
    ],
    process: [
      { num: '01', title: 'Evaluate', desc: 'Rapid assessment of disaster impact and community needs.' },
      { num: '02', title: 'Debris Removal', desc: 'Fast, organized storm debris collection and transport.' },
      { num: '03', title: 'Temporary Housing', desc: 'Emergency housing placement so families have shelter while rebuilding begins.' },
      { num: '04', title: 'Rebuild', desc: 'Permanent housing and infrastructure reconstruction to restore the community.' }
    ]
  },
  {
    file: 'service-plans.html',
    title: 'Plan Development & Drafting',
    tagline: 'Your Vision. Construction Ready.',
    metaDesc: 'Professional plan development and drafting services in Central Louisiana. Construction-ready blueprints, floor plans, elevations, and permitting preparation.',
    heroImg: 'https://jessupconstruct.com/wp-content/uploads/2025/07/Jessup-Construction-3.png',
    heroFallback: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    category: 'Planning',
    intro: 'Every great build starts with a great plan. Jessup Construction\'s drafting professionals bring your ideas to life — creating construction-ready blueprints for ground-up builds or remodeling projects. We handle permitting prep so your project gets approved faster.',
    bullets: [
      'Professional blueprint development',
      'Floor plans and space planning',
      'Building elevations and sections',
      'Construction-ready drawing packages',
      'Permitting preparation and submittals',
      'Cost estimates and budget planning',
      'Industrial and commercial project planning',
      'Design-build services combining planning and construction'
    ],
    process: [
      { num: '01', title: 'Discovery', desc: 'We learn your vision, constraints, and project goals in detail.' },
      { num: '02', title: 'Concept Design', desc: 'Initial floor plans and elevations for your review and feedback.' },
      { num: '03', title: 'Construction Drawings', desc: 'Full construction document package ready for permits and bidding.' },
      { num: '04', title: 'Permit Support', desc: 'We assist with permit submittals and respond to plan review comments.' }
    ]
  }
];

function buildServicePage(svc) {
  const isEmergency = svc.isEmergency || false;
  const accentColor = isEmergency ? 'var(--safety-yellow)' : 'var(--safety-orange)';
  const videoSection = svc.videos && svc.videos.length ? `
    <section class="section-pad section-dark" aria-label="Project videos">
      <div class="container">
        <p class="label" style="margin-bottom:var(--space-4)">See Our Work</p>
        <h2 class="section-title" style="margin-bottom:var(--space-8)">Project Videos</h2>
        <div class="grid-2">
          ${svc.videos.map(v => `
          <div class="video-wrapper scroll-reveal">
            <video controls muted playsinline poster="">
              <source src="${v.src}" type="video/mp4">
            </video>
            <div style="position:absolute;bottom:0;left:0;right:0;padding:var(--space-4);background:linear-gradient(transparent,rgba(0,0,0,0.7));">
              <span style="font-family:var(--font-heading);font-size:var(--text-small);color:var(--concrete-white);">${v.label}</span>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
    </section>
  ` : '';

  const processHTML = svc.process.map((p, i) => `
    <div class="process-step scroll-reveal" data-delay="${i}">
      <div class="process-step-num">${p.num}</div>
      <div class="process-step-title">${p.title}</div>
      <div class="process-step-desc">${p.desc}</div>
    </div>
  `).join('');

  const bulletsHTML = svc.bullets.map(b => `
    <div class="check-item">
      <div class="check-icon" style="border-color:${accentColor};color:${accentColor};">&#10003;</div>
      <span>${b}</span>
    </div>
  `).join('');

  const emergencyBanner = isEmergency ? `
    <div style="background:rgba(255,193,7,0.08);border:2px solid var(--safety-yellow);border-radius:var(--radius-md);padding:var(--space-6);margin-bottom:var(--space-8);display:flex;align-items:center;gap:var(--space-4);">
      <span style="font-size:2rem;">&#9888;&#65039;</span>
      <div>
        <p style="font-family:var(--font-heading);color:var(--safety-yellow);font-weight:700;font-size:var(--text-small);letter-spacing:var(--tracking-wider);text-transform:uppercase;">24/7 Emergency Response Available</p>
        <p style="color:var(--concrete-mid);font-size:0.9rem;">Call now for immediate assistance: <a href="tel:+13182296204" style="color:var(--safety-yellow);font-weight:700;">(318) 229-6204</a></p>
      </div>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${svc.title} | Jessup Construction — Central Louisiana</title>
  <meta name="description" content="${svc.metaDesc}">
  <link rel="icon" type="image/png" href="https://jessupconstruct.com/wp-content/uploads/2021/10/Untitled-design-71.png">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${NAV}
<main id="main">

<!-- HERO -->
<section style="position:relative;min-height:60vh;display:flex;align-items:flex-end;overflow:hidden;padding-top:80px;" aria-label="${svc.title} hero">
  <img src="${svc.heroImg}" alt="${svc.title} — Jessup Construction"
       style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;"
       onerror="this.src='${svc.heroFallback || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80'}'">
  <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.5) 60%,rgba(0,0,0,0.2) 100%);z-index:1;"></div>
  <div class="container" style="position:relative;z-index:2;padding-bottom:var(--space-16);">
    <p style="font-family:var(--font-mono);font-size:var(--text-micro);letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--steel-mid);margin-bottom:var(--space-3);">
      <a href="index.html" style="color:var(--steel-mid);">Home</a> &rsaquo;
      <a href="services.html" style="color:var(--steel-mid);">Services</a> &rsaquo;
      ${svc.title}
    </p>
    ${isEmergency ? '<div style="display:inline-flex;align-items:center;gap:var(--space-2);background:rgba(255,193,7,0.15);border:1px solid var(--safety-yellow);border-radius:100px;padding:4px 16px;margin-bottom:var(--space-4);"><span style="font-size:0.8rem;font-family:var(--font-heading);color:var(--safety-yellow);letter-spacing:var(--tracking-wider);text-transform:uppercase;">Emergency Service</span></div>' : `<p class="label" style="margin-bottom:var(--space-3);">${svc.category}</p>`}
    <h1 style="font-family:var(--font-display);font-size:var(--text-h1);letter-spacing:var(--tracking-tight);color:var(--concrete-white);margin-bottom:var(--space-3);">${svc.title.toUpperCase()}</h1>
    <p style="font-family:var(--font-heading);font-size:var(--text-h3);color:${accentColor};margin-bottom:var(--space-6);">${svc.tagline}</p>
    <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;">
      <a href="quote.html" class="btn btn-primary">Get Free Quote</a>
      <a href="tel:+13182296204" class="btn btn-outline">&#128222; Call Now</a>
    </div>
  </div>
</section>

<!-- CONTENT -->
<section class="section-pad section-dark" aria-label="${svc.title} services">
  <div class="container">
    <div class="grid-2" style="gap:var(--space-12);align-items:start;">
      <div class="scroll-reveal">
        ${emergencyBanner}
        <p class="label" style="margin-bottom:var(--space-3);">Overview</p>
        <div class="rebar-line"></div>
        <h2 class="section-title" style="font-size:var(--text-h2);margin-bottom:var(--space-6);">${svc.tagline}</h2>
        <p style="color:var(--concrete-mid);line-height:var(--leading-normal);margin-bottom:var(--space-8);">${svc.intro}</p>
        <a href="quote.html" class="btn btn-primary">Request Free Quote &rarr;</a>
      </div>
      <div class="scroll-reveal" data-delay="1">
        <p style="font-family:var(--font-heading);font-size:var(--text-small);font-weight:700;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--concrete-white);margin-bottom:var(--space-6);">What's Included</p>
        <div class="check-list">
          ${bulletsHTML}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- OUR PROCESS -->
<section class="section-pad" style="background:#15191d;" aria-label="Our process">
  <div class="container">
    <div style="text-align:center;margin-bottom:var(--space-12);" class="scroll-reveal">
      <p class="label">Step by Step</p>
      <div class="rebar-line" style="margin:var(--space-4) auto;"></div>
      <h2 class="section-title" style="font-size:var(--text-h2);">Our Process</h2>
    </div>
    <div class="process-steps">
      ${processHTML}
    </div>
  </div>
</section>

${videoSection}

<!-- WHY JESSUP -->
<section class="section-pad section-dark" aria-label="Why Jessup">
  <div class="container">
    <div style="text-align:center;margin-bottom:var(--space-12);" class="scroll-reveal">
      <p class="label">Why Choose Us</p>
      <div class="rebar-line" style="margin:var(--space-4) auto;"></div>
      <h2 class="section-title" style="font-size:var(--text-h2);">The Jessup Advantage</h2>
    </div>
    <div class="grid-3">
      <div class="value-card scroll-reveal" data-delay="0">
        <p style="font-size:1.5rem;margin-bottom:var(--space-3);">&#128587;</p>
        <h3 class="value-title">30+ Years Experience</h3>
        <p class="value-desc">Three decades of Central Louisiana construction expertise. We've seen everything and built everything.</p>
      </div>
      <div class="value-card scroll-reveal" data-delay="1">
        <p style="font-size:1.5rem;margin-bottom:var(--space-3);">&#127902;&#65039;</p>
        <h3 class="value-title">Licensed &amp; Insured</h3>
        <p class="value-desc">Licensed for commercial and residential construction. Fully bonded and insured for your protection on every project.</p>
      </div>
      <div class="value-card scroll-reveal" data-delay="2">
        <p style="font-size:1.5rem;margin-bottom:var(--space-3);">&#9989;</p>
        <h3 class="value-title">ISN Certified</h3>
        <p class="value-desc">ISNetworld and RAVS+ certified. CAGE Code qualified for federal and government work. We meet the highest standards.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="section-pad" style="background:var(--concrete-deep);text-align:center;" aria-label="Get a quote">
  <div class="container">
    <div class="scroll-reveal">
      <p class="label">Ready to Start?</p>
      <div class="rebar-line" style="margin:var(--space-4) auto;"></div>
      <h2 class="section-title" style="margin-bottom:var(--space-4);">Get Your Free ${svc.title} Quote</h2>
      <p style="color:var(--concrete-mid);max-width:500px;margin:0 auto var(--space-8);">Contact us to discuss your project and get a detailed estimate. We respond promptly.</p>
      <div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap;">
        <a href="quote.html" class="btn btn-primary">Request Free Quote</a>
        <a href="tel:+13182296204" class="btn btn-outline">&#128222; (318) 229-6204</a>
      </div>
    </div>
  </div>
</section>

</main>
${FOOTER}
</body>
</html>`;
}

// Generate all pages
const outputDir = path.join(__dirname);
services.forEach(svc => {
  const html = buildServicePage(svc);
  const fp = path.join(outputDir, svc.file);
  fs.writeFileSync(fp, html, 'utf8');
  console.log(`✓ Created: ${svc.file}`);
});

console.log(`\n✅ Generated ${services.length} service pages`);
