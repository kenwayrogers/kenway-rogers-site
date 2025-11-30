#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories
const SRC_DIR = path.join(__dirname, 'src');
const PARTIALS_DIR = path.join(SRC_DIR, 'partials');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const DIST_DIR = __dirname; // Build to root for now

// Check if optimized mode
const args = process.argv.slice(2);
const OPTIMIZED = args.includes('--optimized');

// Read partial files
const partials = {
  nav: fs.readFileSync(path.join(PARTIALS_DIR, 'nav.html'), 'utf8'),
  footer: fs.readFileSync(path.join(PARTIALS_DIR, 'footer.html'), 'utf8'),
  contactModal: fs.readFileSync(path.join(PARTIALS_DIR, 'contact-modal.html'), 'utf8'),
  headCommon: fs.readFileSync(path.join(PARTIALS_DIR, 'head-common.html'), 'utf8')
};

// Load optimized assets if available
let criticalCSS = '';
let fontLoadingSnippet = '';
if (OPTIMIZED) {
  try {
    criticalCSS = fs.readFileSync(path.join(DIST_DIR, 'critical.min.css'), 'utf8');
    fontLoadingSnippet = fs.readFileSync(path.join(DIST_DIR, 'font-loading.html'), 'utf8');
  } catch (e) {
    console.warn('⚠️  Optimized assets not found. Run "npm run optimize" first.');
  }
}

// Navigation configurations for different pages
const navConfigs = {
  home: `<li><a href="#caseStudies">Case Studies</a></li>
        <li><a href="about.html">About</a></li>`,
  
  about: `<li><a href="index.html">Home</a></li>
        <li><a href="#" class="contact-open">Contact</a></li>`,
  
  services: `<li><a href="index.html#services">Services</a></li>
        <li><a href="index.html#caseStudies">Case Studies</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="#" class="contact-open">Contact</a></li>`,
  
  case: `<li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="#" class="contact-open">Contact</a></li>`
};

// Template processor
function processTemplate(content, config = {}) {
  let result = content;
  
  // Replace nav links
  const navLinks = config.navType ? navConfigs[config.navType] : navConfigs.home;
  const nav = partials.nav.replace('{{NAV_LINKS}}', navLinks);
  
  // Replace placeholders
  result = result.replace('{{NAV}}', nav);
  result = result.replace('{{FOOTER}}', partials.footer);
  result = result.replace('{{CONTACT_MODAL}}', partials.contactModal);
  
  // Handle optimized vs normal head
  if (OPTIMIZED && criticalCSS) {
    const optimizedHead = partials.headCommon
      .replace('href="style.css"', 'href="style.min.css"')
      .replace('src="script.js"', 'src="script.min.js"')
      .replace(/<link rel="preconnect"[\s\S]*?rel="stylesheet">/, fontLoadingSnippet);
    
    result = result.replace('{{HEAD_COMMON}}', optimizedHead);
    
    // Inject critical CSS inline
    result = result.replace('</head>', `<style>${criticalCSS}</style>\n</head>`);
  } else {
    result = result.replace('{{HEAD_COMMON}}', partials.headCommon);
  }
  
  return result;
}

// Build all pages from src/pages/*.html
function buildPages() {
  console.log('🔨 Building pages...');
  
  // Check if pages directory exists
  if (!fs.existsSync(PAGES_DIR)) {
    console.log('⚠️  No src/pages directory found. Skipping page build.');
    console.log('📝 To use the build system, move your HTML files to src/pages/');
    return;
  }

  const pageFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));
  
  if (pageFiles.length === 0) {
    console.log('⚠️  No HTML files found in src/pages/');
    return;
  }

  pageFiles.forEach(file => {
    const content = fs.readFileSync(path.join(PAGES_DIR, file), 'utf8');
    
    // Determine nav type from filename
    let navType = 'home';
    if (file.includes('about')) navType = 'about';
    else if (file.includes('case')) navType = 'case';
    else if (file.includes('provenance') || file.includes('acquisition') || file.includes('field-investigation')) {
      navType = 'services';
    }
    
    const processed = processTemplate(content, { navType });
    
    // Write to dist (root directory for now)
    const outputPath = path.join(DIST_DIR, file);
    fs.writeFileSync(outputPath, processed);
    console.log(`✅ Built ${file}`);
  });
  
  console.log('✨ Build complete!');
}

// Watch mode
function watch() {
  console.log('👀 Watching for changes...');
  
  const watchDirs = [PARTIALS_DIR, PAGES_DIR];
  
  watchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith('.html')) {
          console.log(`\n📝 ${filename} changed, rebuilding...`);
          buildPages();
        }
      });
    }
  });
}

// Main
buildPages();

if (args.includes('--watch') || args.includes('-w')) {
  watch();
}

if (OPTIMIZED) {
  console.log('🚀 Built with optimizations enabled!');
}
