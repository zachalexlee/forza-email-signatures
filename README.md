# Forza Payments — Email Signature Builder

Internal tool for creating on-brand email signatures for Forza Payments (Forza ATM) employees.
Zero dependencies, no build step — open `index.html` in a browser or host the folder on any
static host (GitHub Pages works out of the box).

See [PLAN.md](PLAN.md) for the research and build plan.

## Features

- **4 templates** — Classic, Modern, Compact, Executive — with live preview
- **Brand-locked styling** — palette and company defaults come from `js/brand.js`
- **Full detail form** — name, title, department, phones, email, website, address, headshot
- **Social icons** — LinkedIn, X, Facebook, Instagram, YouTube (color or monochrome)
- **CTA button + promo banner** — e.g. "Get a Free ATM Quote"
- **Legal disclaimer presets** + custom text
- **UTM tracking** — optional tags on links so clicks show up in web analytics
- **Email-safe output** — table layout, inline styles, web-safe fonts (renders in Outlook desktop)
- **Export** — copy as rich text, copy raw HTML, or download an .html file
- **Install guides** — Gmail, new/classic Outlook, Apple Mail, iPhone
- **Dark-mode & mobile preview** toggles
- **Autosave** — drafts persist in the browser (localStorage)
- **Team mode** — upload a CSV roster, get one file with a ready-to-copy signature per employee

## Branding

Everything brand-related lives in **`js/brand.js`** (mirrored as CSS variables at the top of
`css/styles.css`). The palette — Forza Red `#D00F10` on black `#1C1C1C` — was extracted from the
official logo, and the official logo files live in `assets/` (`forza-logo.png`,
`forza-logo-white-bg.png`, `forza-icon.png`). Signatures reference the logo at its hosted URL,
`https://forza-email-signatures.vercel.app/assets/forza-logo.png`.

> Why hosted logo URLs? Gmail and Outlook strip or block embedded (base64) images, so signature
> images must be publicly hosted. If the app moves to a different domain, update `logoUrl` in
> `js/brand.js`.

## Running locally

```bash
# any static server works; or just double-click index.html
python3 -m http.server 8080
```

Then open http://localhost:8080.
