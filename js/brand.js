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

  // Font choices for the builder. Email-safe stacks only — web fonts don't
  // load in most email clients, so anything fancier falls back unpredictably.
  fontChoices: [
    { name: "Template default", stack: "" },
    { name: "Arial (clean sans)", stack: "Arial, Helvetica, sans-serif" },
    { name: "Helvetica", stack: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    { name: "Verdana (wide sans)", stack: "Verdana, Geneva, sans-serif" },
    { name: "Tahoma (compact sans)", stack: "Tahoma, Geneva, sans-serif" },
    { name: "Trebuchet MS (friendly sans)", stack: "'Trebuchet MS', Tahoma, sans-serif" },
    { name: "Georgia (modern serif)", stack: "Georgia, 'Times New Roman', serif" },
    { name: "Palatino (elegant serif)", stack: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
    { name: "Times New Roman (classic serif)", stack: "'Times New Roman', Times, serif" },
    { name: "Courier New (typewriter)", stack: "'Courier New', Courier, monospace" },
  ],

  // Where personal booking pages live (meeting booker).
  bookingBase: "https://forza-email-signatures.vercel.app/book.html",

  // Pre-designed banner gallery. An admin can rotate the whole team's promo
  // by editing this list — the builder shows these as one-click choices.
  banners: [
    { label: "Free ATM quote", text: "Get a Free ATM Quote — hassle-free install & 24/7 support", url: "https://forzapayments.com" },
    { label: "2,000+ customers", text: "Trusted by 2,000+ businesses nationwide • 30+ years in ATMs", url: "https://forzapayments.com" },
    { label: "24/7 support", text: "24/7 support line • 4 regional support centers", url: "https://forzapayments.com" },
    { label: "Card processing", text: "Now offering credit card processing for retail & restaurants", url: "https://forzapayments.com" },
    { label: "Referral", text: "Refer a business, earn a bonus — ask me how", url: "https://forzapayments.com" },
  ],

  // Department presets — one click fills shared contact details.
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
      "CONFIDENTIALITY NOTICE: This email and any attachments are intended solely for the addressee and may contain confidential or privileged information. Any unauthorized review, use, disclosure, or distribution is prohibited. If you received this in error, please notify the sender and delete all copies. Forza Payments Inc. | Lakewood, WA",
  },
};
