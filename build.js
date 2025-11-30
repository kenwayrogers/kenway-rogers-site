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
  home: `<li><a href="/#caseStudies">Case Studies</a></li>
        <li><a href="/about/">About</a></li>
        <li><a href="#" class="contact-open">Contact</a></li>`,
  
  about: `<li><a href="/">Home</a></li>
        <li><a href="#" class="contact-open">Contact</a></li>`,
  
  services: `<li><a href="/#services">Services</a></li>
        <li><a href="/#caseStudies">Case Studies</a></li>
        <li><a href="/about/">About</a></li>
        <li><a href="#" class="contact-open">Contact</a></li>`,
  
  case: `<li><a href="/">Home</a></li>
        <li><a href="/about/">About</a></li>
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

// Recursively find all HTML files in a directory
function findHTMLFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHTMLFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Build all pages from src/pages/**/*.html
function buildPages() {
  console.log('🔨 Building pages...');
  
  // Check if pages directory exists
  if (!fs.existsSync(PAGES_DIR)) {
    console.log('⚠️  No src/pages directory found. Skipping page build.');
    console.log('📝 To use the build system, move your HTML files to src/pages/');
    return;
  }

  const pageFiles = findHTMLFiles(PAGES_DIR);
  
  if (pageFiles.length === 0) {
    console.log('⚠️  No HTML files found in src/pages/');
    return;
  }

  pageFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Get relative path from PAGES_DIR
    const relativePath = path.relative(PAGES_DIR, filePath);
    const fileName = path.basename(filePath);
    
    // Determine nav type from path
    let navType = 'home';
    if (relativePath.includes('about')) navType = 'about';
    else if (relativePath.includes('case')) navType = 'case';
    else if (relativePath.includes('provenance') || relativePath.includes('acquisition') || relativePath.includes('field-investigation')) {
      navType = 'services';
    }
    
    const processed = processTemplate(content, { navType });
    
    // Determine output path maintaining directory structure
    const outputPath = relativePath === fileName 
      ? path.join(DIST_DIR, fileName)
      : path.join(DIST_DIR, path.dirname(relativePath), fileName);
    
    // Create output directory if needed
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, processed);
    console.log(`✅ Built ${relativePath}`);
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
