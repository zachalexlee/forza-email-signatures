/*
 * Forza Payments brand configuration.
 * Sourced from the Forza Payments Design System (claude.ai artifact, Nov 2026):
 * tokens.json palette, Rajdhani/Inter type, official logo assets, and the
 * design system's email-signature spec.
 */
const FORZA_BRAND = {
  companyName: "Forza Payments, Inc.",
  companyShort: "Forza Payments",
  tagline: "Merchant services & ATM solutions · 30+ years · Nationwide placement and 24/7 support",
  website: "https://forzapayments.com",
  websiteDisplay: "forzapayments.com",
  phone: "(888) 302-3401",

  // Official logo assets, hosted by this app's own deployment.
  // Per the design system: signatures use the FP mark, never the full lockup.
  logoUrl: "https://forza-email-signatures.vercel.app/assets/brand/forza-f-mark.png",
  lockupUrl: "https://forza-email-signatures.vercel.app/assets/brand/forza-lockup.png",

  colors: {
    primary: "#111111",    // carbon — headings, name
    accent: "#F00411",     // Forza red — the one loud color
    accentDark: "#C9000B", // red-600 hover
    text: "#4B5563",       // body text (neutral-600)
    muted: "#6B7280",      // labels, separators (neutral-500)
    faint: "#9CA3AF",      // taglines, disclaimers (neutral-400)
    light: "#F4F5F7",      // paper
    border: "#E5E7EB",     // neutral-200 hairline
    white: "#FFFFFF",
  },

  accentChoices: [
    { name: "Forza Red", value: "#F00411" },
    { name: "Carbon", value: "#111111" },
    { name: "Deep Red", value: "#9B0008" },
    { name: "Slate", value: "#4B5563" },
  ],

  fonts: {
    sans: "'Inter', Arial, Helvetica, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
  },

  // Email-safe stacks only — web fonts don't load in most email clients.
  fontChoices: [
    { name: "Template default", stack: "" },
    { name: "Inter / Arial (brand)", stack: "'Inter', Arial, Helvetica, sans-serif" },
    { name: "Arial (clean sans)", stack: "Arial, Helvetica, sans-serif" },
    { name: "Helvetica", stack: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    { name: "Verdana (wide sans)", stack: "Verdana, Geneva, sans-serif" },
    { name: "Tahoma (compact sans)", stack: "Tahoma, Geneva, sans-serif" },
    { name: "Trebuchet MS (friendly sans)", stack: "'Trebuchet MS', Tahoma, sans-serif" },
    { name: "Georgia (modern serif)", stack: "Georgia, 'Times New Roman', serif" },
    { name: "Palatino (elegant serif)", stack: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
    { name: "Times New Roman (classic serif)", stack: "'Times New Roman', Times, serif" },
  ],

  // Where personal booking pages live (meeting booker).
  bookingBase: "https://forza-email-signatures.vercel.app/book.html",

  // Pre-designed banner gallery — voice per the brand book: short declaratives,
  // hard numbers, verb-forward CTAs, no emoji.
  banners: [
    { label: "Free ATM quote", text: "Get a free ATM quote — free shipping and installation", url: "https://forzapayments.com" },
    { label: "Surcharge revenue", text: "Your ATM should earn for you, not for the provider", url: "https://forzapayments.com" },
    { label: "2,000+ customers", text: "2,000+ customers nationwide. 30+ years in the ATM business.", url: "https://forzapayments.com" },
    { label: "24/7 support", text: "24/7 support. 4 regional support centers.", url: "https://forzapayments.com" },
    { label: "7-10 days", text: "Receive and start using your new ATM within 7-10 business days", url: "https://forzapayments.com" },
  ],

  departments: {
    "": { label: "— none —" },
    sales: { label: "ATM Sales", department: "ATM Sales", phone: "(888) 302-3401", address: "5726 100th St SW Ste B, Lakewood, WA 98499" },
    merchant: { label: "Merchant Services", department: "Merchant Services", phone: "(888) 302-3401", address: "5726 100th St SW Ste B, Lakewood, WA 98499" },
    support: { label: "Support (24/7)", department: "Customer Support", phone: "(888) 302-3401", address: "5726 100th St SW Ste B, Lakewood, WA 98499" },
    ops: { label: "Operations", department: "Operations", phone: "(888) 302-3401", address: "5726 100th St SW Ste B, Lakewood, WA 98499" },
  },

  disclaimers: {
    none: "",
    confidentiality:
      "CONFIDENTIALITY NOTICE: This email and any attachments are intended solely for the addressee and may contain confidential information. If you received this in error, please notify the sender and delete it.",
    environment:
      "Please consider the environment before printing this email.",
    full:
      "CONFIDENTIALITY NOTICE: This email and any attachments are intended solely for the addressee and may contain confidential or privileged information. Any unauthorized review, use, disclosure, or distribution is prohibited. If you received this in error, please notify the sender and delete all copies. Forza Payments, Inc. | Lakewood, WA",
  },
};
