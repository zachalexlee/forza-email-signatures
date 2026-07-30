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

## Updating the branding

Everything brand-related lives in **`js/brand.js`**:

1. Replace the provisional hex codes in `colors` (and the matching CSS variables at the top of
   `css/styles.css`) with the exact values from forzaatm.com.
2. Set `logoUrl` to a hosted logo image (e.g. the logo file on forzaatm.com). Until then,
   signatures use a text-based FORZA wordmark that renders in every client.
3. `assets/forza-logo.svg` is a recreated placeholder wordmark used in the app header — swap it
   for the official file.

> Why hosted logo URLs? Gmail and Outlook strip or block embedded (base64) images, so signature
> images must be publicly hosted.

## Running locally

```bash
# any static server works; or just double-click index.html
python3 -m http.server 8080
```

Then open http://localhost:8080.
