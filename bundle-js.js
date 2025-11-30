#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SRC_JS_DIR = path.join(__dirname, 'src', 'js');
const OUTPUT_FILE = path.join(__dirname, 'script.js');

console.log('📦 Bundling JavaScript modules...');

// Read all module files
const utils = fs.readFileSync(path.join(SRC_JS_DIR, 'utils.js'), 'utf8');
const scroll = fs.readFileSync(path.join(SRC_JS_DIR, 'scroll.js'), 'utf8');
const modal = fs.readFileSync(path.join(SRC_JS_DIR, 'modal.js'), 'utf8');
const lightbox = fs.readFileSync(path.join(SRC_JS_DIR, 'lightbox.js'), 'utf8');
const main = fs.readFileSync(path.join(SRC_JS_DIR, 'main.js'), 'utf8');

// Remove import/export statements and wrap in IIFE
function stripImportsExports(code) {
  return code
    .replace(/^import .+ from .+;?\n?/gm, '')
    .replace(/^export /gm, '');
}

// Bundle everything into one file
const bundled = `// Bundled from modular sources in src/js/
// To modify, edit files in src/js/ and run: node bundle-js.js

(function() {
  'use strict';

  // ===== utils.js =====
  ${stripImportsExports(utils)}

  // ===== scroll.js =====
  ${stripImportsExports(scroll)}

  // ===== modal.js =====
  ${stripImportsExports(modal)}

  // ===== lightbox.js =====
  ${stripImportsExports(lightbox)}

  // ===== main.js (initialization) =====
  ${stripImportsExports(main)}
})();
`;

fs.writeFileSync(OUTPUT_FILE, bundled);
console.log(`✅ Bundled to ${OUTPUT_FILE}`);
console.log('💡 To rebuild after changes: node bundle-js.js');
