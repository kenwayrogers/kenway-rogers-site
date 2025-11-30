# JavaScript Modules

This directory contains modular JavaScript source files that are bundled into the root `script.js`.

## Structure

- **`utils.js`** - Utility functions (easing, smooth scroll)
- **`scroll.js`** - Scroll behavior, parallax effects, card reveals
- **`modal.js`** - Contact modal and email menu functionality
- **`lightbox.js`** - Image lightbox functionality
- **`main.js`** - Entry point that initializes all modules

## Building

After making changes to any module:

```bash
npm run build:js
```

Or directly:

```bash
node bundle-js.js
```

This will regenerate `/script.js` from the modular sources.

## Development Workflow

1. Edit files in `src/js/`
2. Run `npm run build:js` to bundle
3. Test changes in browser

For continuous development, you can use:

```bash
npm run dev
```

This bundles JS, builds HTML pages, and starts the dev server.
