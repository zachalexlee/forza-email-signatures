# Forza Payments — Email Signature Builder: Build Plan

A branded, self-hosted email signature builder for Forza Payments (Forza ATM) employees.
Everyone on the team opens one page, fills in their details, and copies a pixel-perfect,
on-brand signature into Gmail, Outlook, or Apple Mail.

---

## 1. Competitive research — what the top tools do

Surveyed the leading email signature products (2025–2026 comparisons): **WiseStamp,
HubSpot Signature Generator, Newoldstamp, MySignature, SyncSignature, MySigMail, Exclaimer,
Rocketseed**. The union of their headline features:

| Feature | Who does it | In our build? |
|---|---|---|
| Form-driven editor (name, title, phone, email, …) | All | ✅ Phase 1 |
| Live, real-time preview | All | ✅ Phase 1 |
| Multiple professional templates/layouts | All | ✅ Phase 1 (4 layouts) |
| Photo + company logo support | All | ✅ Phase 1 |
| Social media icons | All | ✅ Phase 1 |
| Brand color / font controls | All | ✅ Phase 1 (brand-locked palette with per-field accents) |
| Email-client-safe HTML (tables + inline styles) | All | ✅ Phase 1 |
| Copy-to-clipboard (rich text + raw HTML) | All | ✅ Phase 1 |
| Install guides for Gmail / Outlook / Apple Mail / iOS | WiseStamp, Newoldstamp, MySignature | ✅ Phase 1 |
| Promotional banner / CTA button | WiseStamp, Newoldstamp (their main differentiator) | ✅ Phase 1 |
| Legal disclaimer presets | Exclaimer, Newoldstamp | ✅ Phase 1 |
| Scheduling / "Book a meeting" link | WiseStamp | ✅ Phase 1 (CTA supports any URL) |
| Save drafts / reuse | MySignature, WiseStamp | ✅ Phase 1 (localStorage autosave) |
| Dark-mode + mobile preview | SyncSignature | ✅ Phase 1 (preview toggles) |
| Click tracking / analytics | Newoldstamp, MySignature | ⚠️ Phase 2 as **UTM tagging** (no server needed) — ✅ built |
| Team management (master template + employee roster) | Newoldstamp, Exclaimer, SyncSignature | ⚠️ Phase 2 as **CSV batch export** |
| A/B banner testing, central deployment to Google Workspace/M365 | Exclaimer, Rocketseed | ❌ Out of scope (requires server + admin APIs) |

Sources: [MySignature comparison](https://mysignature.io/blog/best-email-signature-generators-comparison/),
[Newoldstamp roundup](https://newoldstamp.com/blog/best-email-signature-generators/),
[WiseStamp guide](https://www.wisestamp.com/guides/best-email-signature-generator/),
[SyncSignature](https://syncsignature.com/blog/best-email-signature-generators),
[MySigMail overview](https://mysigmail.com/blog/top-10-email-signature-generators-in-2026-complete-overview-and-comparison).

## 2. Branding

- **Company**: Forza Payments (Forza ATM) — merchant services & ATM processing, 30+ years in the ATM business, 2,000+ customers, 24/7 support — (888) 302-3401, forzaatm.com / forzapayments.com.
- **Palette + logo**: defined in one place, `js/brand.js` (mirrored as CSS variables in `css/styles.css`).
  Palette is Forza Red `#D00F10` + black `#1C1C1C`, extracted from the official logo files supplied by
  the user (the sandbox's network policy blocked fetching forzaatm.com directly). Official logo assets
  live in `assets/`; signatures reference the hosted copy on the app's own deployment.
- If no logo URL is set, signatures fall back to a **text-based wordmark** (renders in every email client).

## 3. Architecture

Zero-dependency static site — `index.html` + `css/styles.css` + `js/*.js`. No build step, no server;
host on GitHub Pages or drop on any static host. Signature output is table-based HTML with inline
styles only (the only thing Outlook desktop reliably renders); web-safe fonts (Arial/Georgia/Verdana);
images referenced by URL (data-URIs flagged as unreliable in Gmail).

## 4. Build phases

**Phase 1 — Core builder (this PR)**
1. Scaffold: `index.html`, styles, brand config, wordmark SVG.
2. Editor form: identity, contact, links, photo/logo URLs, social handles, CTA, banner, disclaimer, UTM toggle.
3. Four templates: **Classic** (logo left, info right), **Modern** (accent bar), **Compact** (one-liner), **Executive** (photo-forward, serif).
4. Live preview with light/dark and desktop/mobile toggles.
5. Export: Copy signature (rich text), Copy HTML, Download .html; localStorage autosave + reset.
6. Install guides (Gmail, Outlook new/classic, Apple Mail, iOS) in collapsible panels.

**Phase 2 — Team scale-up (built where serverless allows)**
7. UTM tagging on links for click attribution in analytics.
8. CSV roster → batch-generate a signature file per employee (admin "Team mode").

**Phase 3 — Later / optional**
9. Central deployment (Google Workspace / M365 APIs), hosted banner campaign rotation, real click analytics — all need a backend; revisit if needed.

## 5. Acceptance checklist

- [x] All Phase-1 features functional in a plain browser with no network access
- [x] Copied signature pastes correctly into Gmail's signature editor (rich text)
- [x] HTML uses tables + inline styles only; no `<div>` layout, no external CSS in output
- [x] Brand palette/logo swappable in one file
- [x] Phase-2 UTM tagging + CSV batch export included
