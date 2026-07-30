/*
 * Forza Payments brand configuration.
 *
 * ⚠️ PROVISIONAL PALETTE: the build environment could not reach forzaatm.com,
 * so these are placeholder finance-brand values. Replace the hex codes and
 * logoUrl with the real ones from forzaatm.com — every template and the app
 * chrome read from this object (and the matching CSS variables in styles.css).
 */
const FORZA_BRAND = {
  companyName: "Forza Payments",
  tagline: "ATM & Merchant Services",
  website: "https://forzapayments.com",
  websiteDisplay: "forzapayments.com",
  phone: "(888) 302-3401",

  // Hosted logo for use inside signatures. Leave "" to use the text wordmark,
  // which renders reliably in every email client.
  logoUrl: "",

  colors: {
    primary: "#0A2743",   // deep navy — headings, name
    accent: "#0E9F5B",    // cash green — links, accents, CTA
    accentDark: "#0B7A46",
    text: "#3D4852",      // body text
    muted: "#8795A1",     // secondary text, separators
    light: "#F1F5F8",     // banner background
    white: "#FFFFFF",
  },

  // Accent choices offered in the builder (all stay on-brand).
  accentChoices: [
    { name: "Forza Green", value: "#0E9F5B" },
    { name: "Navy", value: "#0A2743" },
    { name: "Steel Blue", value: "#2C6E9B" },
    { name: "Gold", value: "#C8A24B" },
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
