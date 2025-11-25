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

GitHub Pages deployment
-----------------------
This site is a plain static site and can be published via GitHub Pages with no build steps.

Steps to deploy on GitHub Pages:
1. Push your code to GitHub (to the `main` branch).
2. In your repository, go to Settings → Pages.
3. Under "Build and deployment", select `main` as the branch and `/ (root)` as the folder.
4. Save and wait for GitHub to build and publish your site.
5. Your site will be accessible at `https://<your-github-username>.github.io/<repository-name>/`.

Notes
- A `index.html` at the repository root will be served as the homepage.
- GitHub Pages is static-only; there are no serverless functions or dynamic backend support.

Contact form & email behavior (static site)
-------------------------------------------
This site uses a client-side `mailto:` approach for the contact modal — there is no backend or 3rd-party form dependency.

How it works:
- When a user fills the contact form and clicks "Send Message", JavaScript builds a `mailto:` URI (to `kenwayrogers@gmail.com`) with a subject and message body prefilled.
- This opens the user's default email client (desktop or web client configured to handle mailto links). The user then sends the message directly from their email client.
 
Gmail integration (web)
----------------------
In addition to the mailto link, there's a "Compose in Gmail" button in the contact modal. Clicking this will open Gmail's web compose window (in a new tab) with the recipient, subject, and body prefilled, which is handy when users prefer to use Gmail web instead of a system mail client.

Notes:
- The Gmail button requires the user to be signed in to Gmail in their browser; otherwise it will prompt sign-in.
- This is a convenience alternative — both the mailto option and Gmail compose are available in the modal.

Notes:
- Because this is a `mailto:` link, the form does not send a request to a server — the user's email client must be configured to send the email.
- If no email client is configured, the browser may show an error or nothing will happen. To accept messages without a mailto client, a server-side service or third-party form provider would be required.
Local testing
-------------
To test locally, serve the site with Python's http server and open it in a browser. Then open DevTools to watch the console logs when the form triggers the mailto link.
```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```



