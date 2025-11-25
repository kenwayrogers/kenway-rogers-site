# kenway-rogers-site
Website for Kenway Rogers

This repository contains a simple static site for Kenway Rogers — Treasure Hunter.

Running locally:

1. Serve the folder from a static web server (Python 3):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

Files added/updated:
- `index.html` — cinematic splash, hero, and case study cards
- `style.css`, `script.js` — updated styling and behaviors
- `case1.html`, `case2.html`, `case3.html` — example case studies

Design: Rustic, parchment-like D&D flavor with tools of the trade imagery, no character portraits.

Netlify deployment
------------------
This site is ready to be deployed directly on Netlify from this repository. No build step is required — Netlify will serve the files from the root of the repository.

Steps to deploy on Netlify:
1. Create an account at https://app.netlify.com/ (if you don't already have one).
2. Click "New site from Git" and connect your Git provider.
3. Select the `kenway-rogers-site` repository and the `main` branch.
4. Leave the build command blank and set the publish directory to `.` (root).
5. Click "Deploy site".

Notes
- Netlify's default behavior will auto-detect many static site generators; since this is a static site, there are no build steps.
- `netlify.toml` includes caching and security headers and points Netlify at the repo root as the publish directory.
- Keep `index.html` at the root — Netlify will serve it as the site's homepage.

Contact form & email delivery
--------------------------------
This project includes a contact modal which submits form data to Netlify Forms directly. Steps to enable email notifications:

1. Deploy the site to Netlify from this repository.
2. In your Netlify dashboard, go to the website settings → Forms.
3. Locate the `contact` form (it will show up as soon as a submission is received or if you trigger a test submit).
4. Add a notification rule in the Netlify UI to notify an email address (e.g., `kenwayrogers@gmail.com`) on new submissions, or connect to Zapier/SendGrid for other email delivery flows.

Note: The form sends submissions using AJAX so the user experience stays in the modal and you can control success/failure messages.



