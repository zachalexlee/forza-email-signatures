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
- **Saved presets** — save named signature configs and share them as pre-filled links
- **Banner gallery** — one-click on-brand promo banners (edit the list in `js/brand.js` to rotate campaigns)
- **QR code** — optional scan-to-save-contact vCard QR
- **Department presets** — auto-fill shared phone/address per department
- **Meeting booker** — self-hosted per-rep scheduling (like Calendly): each rep creates a booking
  page at [meetings.html](meetings.html), visitors book at `book.html?u=<their-name>`, and the
  signature gets a "Book a Meeting" button. Backend is Supabase project `forza-email-signatures`
  (config in `js/booker-config.js`); schema and row-level security live in the project's migrations.
- **Logo styles** — FP mark (monogram), the full FP Forza Payments lockup, a text wordmark, or none;
  the Carbon template uses the dark-surface variants automatically.

## Branding

Everything brand-related lives in **`js/brand.js`** (mirrored as CSS variables at the top of
`css/styles.css`), sourced from the **Forza Payments Design System** (claude.ai artifact):
Forza Red `#F00411` on Carbon `#111111`, paper `#F4F5F7`, Rajdhani display / Inter body type,
4px buttons and 8px cards. Official logo assets live in `assets/brand/` (lockups light/dark,
FP marks light/dark, favicons). Per the design system's email-signature spec, signatures use the
FP mark at `https://forza-email-signatures.vercel.app/assets/brand/forza-f-mark.png` — never the
full lockup. The default "Forza" and "Forza Compact" templates implement the spec exactly
(3px red divider, D/M/E/W contact rows, company tagline). Legacy assets in `assets/` are kept so
signatures already in the wild keep their images.

> Why hosted logo URLs? Gmail and Outlook strip or block embedded (base64) images, so signature
> images must be publicly hosted. If the app moves to a different domain, update `logoUrl` in
> `js/brand.js`.

## Running locally

```bash
# any static server works; or just double-click index.html
python3 -m http.server 8080
```

Then open http://localhost:8080.
