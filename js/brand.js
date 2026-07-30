/*
 * Forza Payments brand configuration.
 *
 * Colors extracted from the official Forza Payments logo (red/black).
 * Every template and the app chrome read from this object (plus the
 * matching CSS variables in styles.css).
 */
const FORZA_BRAND = {
  companyName: "Forza Payments",
  tagline: "ATM & Merchant Services",
  website: "https://forzapayments.com",
  websiteDisplay: "forzapayments.com",
  phone: "(888) 302-3401",

  // Hosted logo used inside signatures (must be a public URL — email clients
  // block embedded images). Served from this app's own deployment.
  logoUrl: "https://forza-email-signatures.vercel.app/assets/forza-logo.png",

  colors: {
    primary: "#1C1C1C",   // Forza black — headings, name
    accent: "#D00F10",    // Forza red — links, accents, CTA
    accentDark: "#A50C0D",
    text: "#3D4145",      // body text
    muted: "#8A8F94",     // secondary text, separators
    light: "#F6F6F6",     // banner background
    white: "#FFFFFF",
  },

  // Accent choices offered in the builder (all stay on-brand).
  accentChoices: [
    { name: "Forza Red", value: "#D00F10" },
    { name: "Black", value: "#1C1C1C" },
    { name: "Charcoal", value: "#55595E" },
    { name: "Dark Red", value: "#A50C0D" },
  ],

  fonts: {
    sans: "Arial, Helvetica, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
  },

  disclaimers: {
    none: "",
    confidentiality:
      "CONFIDENTIALITY NOTICE: This email and any attachments are intended solely for the addressee and may contain confidential information. If you received this in error, please notify the sender and delete it.",
    environment:
      "Please consider the environment before printing this email.",
    full:
      "CONFIDENTIALITY NOTICE: This email and any attachments are intended solely for the addressee and may contain confidential or privileged information. Any unauthorized review, use, disclosure, or distribution is prohibited. If you received this in error, please notify the sender and delete all copies. Forza Payments Inc. | Lakewood, WA",
  },
};
