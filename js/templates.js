/*
 * Signature templates — Forza Payments design system.
 *
 * Every template returns a self-contained, email-client-safe HTML string:
 *   - table-based layout only (no divs/flex/grid — Outlook desktop uses Word's renderer)
 *   - all styles inline; web-safe fonts only
 *   - images referenced by URL (data-URIs are stripped by Gmail)
 */
(function () {
  const B = FORZA_BRAND;

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  }

  function withUtm(url, d) {
    if (!url || !d.utmEnabled) return url;
    try {
      const u = new URL(url);
      if (!/^https?:$/.test(u.protocol)) return url;
      u.searchParams.set("utm_source", "email-signature");
      u.searchParams.set("utm_medium", "email");
      u.searchParams.set("utm_campaign", d.utmCampaign || "forza-signature");
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  function normalizeUrl(url) {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : "https://" + url;
  }

  // Chosen font wins; otherwise serif-flavored templates default to Georgia.
  const SERIF_TEMPLATES = ["executive", "minimal"];
  const FONT = (d) => d.font || (SERIF_TEMPLATES.includes(d.template) ? B.fonts.serif : B.fonts.sans);

  const DOT = `<span style="color:${B.colors.faint};">&nbsp;&middot;&nbsp;</span>`;

  function link(d, href, text, opts = {}) {
    const color = opts.color || d.accent;
    const weight = opts.bold ? "font-weight:bold;" : "";
    return `<a href="${esc(href)}" target="_blank" style="color:${color};text-decoration:none;${weight}font-family:${FONT(d)};font-size:${opts.size || 13}px;">${esc(text)}</a>`;
  }

  function telLink(d, number, opts = {}) {
    return link(d, "tel:" + number.replace(/[^+\d]/g, ""), number, Object.assign({ color: B.colors.text }, opts));
  }

  /* ---------- logo ---------- */
  // d.logoStyle: "mark" (FP monogram, default) | "lockup" (full FP Forza
  // Payments logo) | "text" (typed fallback) | "none".
  function logoImg(d, url, w) {
    return `<a href="${esc(withUtm(normalizeUrl(d.website || B.website), d))}" target="_blank"><img src="${esc(url)}" alt="${esc(B.companyShort || B.companyName)}" width="${w}" style="display:block;border:0;width:${w}px;height:auto;"></a>`;
  }

  function textWordmark(d, big) {
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:${big ? 24 : 20}px;font-weight:bold;font-style:italic;color:${B.colors.primary};letter-spacing:1px;">FORZA</td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;color:${d.accent};letter-spacing:4px;">PAYMENTS</td></tr></table>`;
  }

  function wordmark(d, opts = {}) {
    const style = d.logoStyle || "mark";
    if (style === "none") return "";
    if (style === "text") return textWordmark(d, opts.big);
    if (style === "lockup") {
      // Full lockup is ~4.7:1 — design-system minimum width 120px.
      return logoImg(d, B.lockupUrl, Math.max(opts.lockupWidth || 170, 120));
    }
    // FP mark (~2:1). A custom logo URL overrides it.
    return logoImg(d, d.logoUrl || B.logoUrl, Math.min(opts.width || 86, 96));
  }

  // Lockup banner row used by templates that show the full logo up top.
  function lockupHeader(d, width) {
    if ((d.logoStyle || "mark") !== "lockup") return "";
    return `<tr><td colspan="2" style="padding:0 0 12px;">${logoImg(d, B.lockupUrl, width || 190)}</td></tr>`;
  }

  function photoCell(d, size) {
    if (!d.photoUrl) return "";
    return `<img src="${esc(normalizeUrl(d.photoUrl))}" alt="${esc(d.fullName)}" width="${size}" height="${size}" style="display:block;border-radius:50%;border:0;width:${size}px;height:${size}px;object-fit:cover;">`;
  }

  /* ---------- shared blocks ---------- */
  function ctaButton(d, opts = {}) {
    const btn = (bg, fg, href, label) =>
      `<td style="background-color:${bg};border-radius:4px;"><a href="${esc(href)}" target="_blank" style="display:inline-block;padding:8px 18px;font-family:${FONT(d)};font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${fg};text-decoration:none;">${esc(label)}</a></td>`;
    const cells = [];
    if (d.ctaText && d.ctaUrl) cells.push(btn(d.accent, "#FFFFFF", withUtm(normalizeUrl(d.ctaUrl), d), d.ctaText));
    if (d.bookingUrl) {
      if (cells.length) cells.push(`<td style="width:8px;font-size:0;">&nbsp;</td>`);
      cells.push(btn(opts.bookBg || B.colors.primary, opts.bookColor || "#FFFFFF", withUtm(normalizeUrl(d.bookingUrl), d), "Book a Meeting"));
    }
    if (!cells.length) return "";
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:12px;"><tr>${cells.join("")}</tr></table>`;
  }

  function socialRow(d) {
    const cells = SOCIALS.filter((s) => d[s.key]).map((s) => {
      const href = withUtm(normalizeUrl(d[s.key]), d);
      const bg = d.monoSocial ? d.accent : B.colors.primary;
      return `<td style="padding:0 5px 0 0;"><a href="${esc(href)}" target="_blank" title="${s.name}" style="display:inline-block;width:20px;height:20px;line-height:20px;text-align:center;background-color:${bg};color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;text-decoration:none;border-radius:3px;">${s.label}</a></td>`;
    });
    if (!cells.length) return "";
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:9px;"><tr>${cells.join("")}</tr></table>`;
  }

  const SOCIALS = [
    { key: "linkedin", label: "in", name: "LinkedIn" },
    { key: "twitter", label: "X", name: "X (Twitter)" },
    { key: "facebook", label: "f", name: "Facebook" },
    { key: "instagram", label: "ig", name: "Instagram" },
    { key: "youtube", label: "yt", name: "YouTube" },
  ];

  function qrBlock(d) {
    if (!d.qrEnabled) return "";
    const vcard = [
      "BEGIN:VCARD", "VERSION:3.0",
      `FN:${d.fullName || ""}`,
      d.company ? `ORG:${d.company}` : "",
      d.jobTitle ? `TITLE:${d.jobTitle}` : "",
      d.phone ? `TEL;TYPE=WORK:${d.phone}` : "",
      d.mobile ? `TEL;TYPE=CELL:${d.mobile}` : "",
      d.email ? `EMAIL:${d.email}` : "",
      d.website ? `URL:${normalizeUrl(d.website)}` : "",
      "END:VCARD",
    ].filter(Boolean).join("\n");
    const src = "https://api.qrserver.com/v1/create-qr-code/?size=132x132&data=" + encodeURIComponent(vcard);
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:12px;"><tr><td style="padding:0 10px 0 0;"><img src="${esc(src)}" alt="Scan to save contact" width="64" height="64" style="display:block;border:0;width:64px;height:64px;"></td><td style="font-family:${FONT(d)};font-size:10px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;line-height:1.6;color:${B.colors.faint};">Scan to save<br>my contact</td></tr></table>`;
  }

  function bannerBlock(d) {
    if (!d.bannerText) return "";
    const inner = `<span style="font-family:${FONT(d)};font-size:12.5px;font-weight:bold;color:${B.colors.primary};">${esc(d.bannerText)}</span>`;
    const content = d.bannerUrl
      ? `<a href="${esc(withUtm(normalizeUrl(d.bannerUrl), d))}" target="_blank" style="text-decoration:none;">${inner} <span style="color:${d.accent};font-family:${FONT(d)};font-size:12.5px;font-weight:bold;">&rarr;</span></a>`
      : inner;
    return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:12px;"><tr><td style="background-color:${B.colors.light};border-left:3px solid ${d.accent};padding:10px 14px;">${content}</td></tr></table>`;
  }

  function disclaimerBlock(d) {
    const text = d.disclaimer === "custom" ? d.customDisclaimer : B.disclaimers[d.disclaimer];
    if (!text) return "";
    return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:12px;"><tr><td style="font-family:${FONT(d)};font-size:10px;line-height:14px;color:${B.colors.faint};border-top:1px solid ${B.colors.border};padding-top:8px;">${esc(text)}</td></tr></table>`;
  }

  // Labelled contact rows (D/M/E/W) — the design system's house style.
  function contactRows(d, opts = {}) {
    const size = opts.size || 12;
    const lab = (l) => `<span style="color:${opts.labelColor || B.colors.faint};font-weight:bold;">${l}</span>&nbsp;&nbsp;`;
    let rows = "";
    if (d.phone) rows += lab("D") + telLink(d, d.phone, { size, color: opts.textColor }) + "<br>";
    if (d.mobile) rows += lab("M") + telLink(d, d.mobile, { size, color: opts.textColor }) + "<br>";
    if (d.email) rows += lab("E") + link(d, "mailto:" + d.email, d.email, { size, color: opts.textColor || B.colors.text }) + "<br>";
    if (d.website) rows += lab("W") + link(d, withUtm(normalizeUrl(d.website), d), d.website.replace(/^https?:\/\//i, ""), { bold: true, size }) + "<br>";
    if (!rows) return "";
    return `<div style="font-family:${FONT(d)};font-size:${size}px;color:${opts.textColor || B.colors.text};line-height:1.8;">${rows}</div>`;
  }

  // One-line contact string separated by middots.
  function contactInline(d, opts = {}) {
    const size = opts.size || 12;
    const bits = [];
    if (d.phone) bits.push(telLink(d, d.phone, { size, color: opts.textColor }));
    if (d.mobile && opts.mobile !== false) bits.push(telLink(d, d.mobile, { size, color: opts.textColor }));
    if (d.email) bits.push(link(d, "mailto:" + d.email, d.email, { size, color: opts.textColor || B.colors.text }));
    if (d.website) bits.push(link(d, withUtm(normalizeUrl(d.website), d), d.website.replace(/^https?:\/\//i, ""), { bold: true, size }));
    return bits.join(DOT);
  }

  // Name / title / company stack. Title is uppercase, letter-spaced, red.
  function nameBlock(d, opts = {}) {
    const F = FONT(d);
    const nameSize = opts.nameSize || 17;
    const sub = [d.jobTitle, d.department].filter(Boolean).join(", ");
    let html = `<div style="font-family:${F};font-size:${nameSize}px;font-weight:bold;color:${opts.nameColor || B.colors.primary};line-height:1.25;">${esc(d.fullName)}</div>`;
    if (sub) html += `<div style="font-family:${F};font-size:11px;font-weight:bold;color:${opts.subColor || d.accent};text-transform:uppercase;letter-spacing:1.5px;padding-top:4px;">${esc(sub)}</div>`;
    if (d.company && opts.company !== false) html += `<div style="font-family:${F};font-size:12.5px;font-weight:bold;color:${opts.companyColor || B.colors.primary};padding-top:8px;">${esc(d.company)}</div>`;
    return html;
  }

  function address(d, opts = {}) {
    if (!d.address) return "";
    return `<div style="font-family:${FONT(d)};font-size:11px;color:${opts.color || B.colors.faint};padding-top:5px;">${esc(d.address)}</div>`;
  }

  function wrap(d, inner, width) {
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:${width}px;">${inner}</table>`;
  }

  function tail(d, colspan) {
    return `<tr><td${colspan ? ` colspan="${colspan}"` : ""} style="padding:0;">${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
  }

  /* =======================================================================
     TEMPLATES
     ======================================================================= */
  const TEMPLATES = {};

  // ---- Forza: the design system's email-signature spec ----
  TEMPLATES.forza = function (d) {
    const F = FONT(d);
    const useLockupTop = (d.logoStyle || "mark") === "lockup";
    const leftArt = d.photoUrl ? photoCell(d, 86) : (useLockupTop ? "" : wordmark(d, { width: 86 }));
    const body = `
      ${nameBlock(d)}
      <div style="padding-top:8px;">${contactRows(d)}</div>
      ${address(d)}
      <div style="font-family:${F};font-size:10.5px;color:${B.colors.faint};line-height:1.5;padding-top:12px;max-width:380px;">${esc(B.tagline)}</div>
      ${socialRow(d)}
      ${ctaButton(d)}`;
    const inner = leftArt
      ? `${lockupHeader(d, 190)}
<tr>
  <td style="vertical-align:top;padding:2px 20px 0 0;border-right:3px solid ${d.accent};">${leftArt}</td>
  <td style="vertical-align:top;padding:0 0 0 20px;">${body}</td>
</tr>
${tail(d, 2)}`
      : `${lockupHeader(d, 190)}
<tr><td style="border-left:3px solid ${d.accent};padding:2px 0 2px 20px;">${body}</td></tr>
${tail(d)}`;
    return wrap(d, inner, 540);
  };

  // ---- Forza Compact: the spec's reply/mobile variant ----
  TEMPLATES.forzacompact = function (d) {
    const F = FONT(d);
    const small = (d.logoStyle || "mark") === "lockup"
      ? logoImg(d, B.lockupUrl, 132)
      : (d.photoUrl ? photoCell(d, 48) : wordmark(d, { width: 48 }));
    const bits = [];
    if (d.phone) bits.push(telLink(d, d.phone, { size: 12 }));
    if (d.email) bits.push(link(d, "mailto:" + d.email, d.email, { size: 12, color: B.colors.text }));
    if (d.website) bits.push(link(d, withUtm(normalizeUrl(d.website), d), d.website.replace(/^https?:\/\//i, ""), { bold: true, size: 12 }));
    if (d.bookingUrl) bits.push(link(d, withUtm(normalizeUrl(d.bookingUrl), d), "Book a meeting", { bold: true, color: B.colors.primary, size: 12 }));
    const inner = `
<tr>
  <td style="vertical-align:middle;padding:0 16px 0 0;">${small}</td>
  <td style="vertical-align:middle;border-left:3px solid ${d.accent};padding:3px 0 3px 16px;">
    <div style="font-family:${F};font-size:14px;font-weight:bold;color:${B.colors.primary};">${esc(d.fullName)}${d.jobTitle ? `${DOT}<span style="font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${d.accent};">${esc(d.jobTitle)}</span>` : ""}</div>
    <div style="font-family:${F};font-size:12px;color:${B.colors.text};padding-top:5px;">${bits.join(DOT)}</div>
  </td>
</tr>
${tail(d, 2)}`;
    return wrap(d, inner, 580);
  };

  // ---- Carbon: dark flagship — the signature as an F1 livery card ----
  TEMPLATES.carbon = function (d) {
    const F = FONT(d);
    const faint = "#9CA3AF";
    const logo = (d.logoStyle || "mark") === "lockup"
      ? logoImg(d, "https://forza-email-signatures.vercel.app/assets/brand/forza-lockup-dark.png", 170)
      : ((d.logoStyle || "mark") === "mark"
        ? logoImg(d, "https://forza-email-signatures.vercel.app/assets/brand/forza-f-mark-dark.png", 72)
        : "");
    const site = d.website ? link(d, withUtm(normalizeUrl(d.website), d), d.website.replace(/^https?:\/\//i, ""), { bold: true, size: 12 }) : "";
    const phones = [d.phone, d.mobile].filter(Boolean).map((p) => telLink(d, p, { size: 12, color: "#E5E7EB" })).join(DOT);
    const inner = `
<tr><td style="background-color:${B.colors.primary};border-radius:6px;padding:20px 22px;border-left:4px solid ${d.accent};">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
    <tr>
      <td style="vertical-align:top;">
        <div style="font-family:${F};font-size:18px;font-weight:bold;color:#FFFFFF;line-height:1.2;">${esc(d.fullName)}</div>
        ${d.jobTitle ? `<div style="font-family:${F};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${d.accent === B.colors.primary ? "#FFFFFF" : d.accent};padding-top:5px;">${esc([d.jobTitle, d.department].filter(Boolean).join(", "))}</div>` : ""}
        ${d.company ? `<div style="font-family:${F};font-size:12px;font-weight:bold;color:#E5E7EB;padding-top:10px;">${esc(d.company)}</div>` : ""}
        <div style="font-family:${F};font-size:12px;color:#E5E7EB;line-height:1.8;padding-top:8px;">
          ${phones ? phones + "<br>" : ""}
          ${d.email ? link(d, "mailto:" + d.email, d.email, { size: 12, color: "#E5E7EB" }) + (site ? DOT + site : "") : site}
        </div>
      </td>
      ${d.photoUrl ? `<td style="vertical-align:top;padding:0 0 0 18px;" align="right">${photoCell(d, 72)}</td>`
        : (logo ? `<td style="vertical-align:bottom;padding:0 0 0 18px;" align="right">${logo}</td>` : "")}
    </tr>
    ${(d.photoUrl && logo) ? `<tr><td colspan="2" style="padding:14px 0 0;">${logo}</td></tr>` : ""}
    <tr><td colspan="2" style="padding:2px 0 0;">${socialRow(d)}${ctaButton(d, { bookBg: "#FFFFFF", bookColor: B.colors.primary })}</td></tr>
  </table>
</td></tr>
<tr><td style="font-family:${F};font-size:10px;color:${faint};padding:8px 2px 0;">${esc(B.tagline)}</td></tr>
${tail(d)}`;
    return wrap(d, inner, 560);
  };

  // ---- Classic: art left of a red divider ----
  TEMPLATES.classic = function (d) {
    const left = d.photoUrl ? photoCell(d, 84) : wordmark(d, { width: 80, lockupWidth: 150 });
    const bottomLogo = d.photoUrl
      ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:12px;"><tr><td>${wordmark(d, { width: 80, lockupWidth: 150 })}</td></tr></table>` : "";
    const inner = `
<tr>
  <td style="vertical-align:top;padding:2px 18px 2px 0;border-right:3px solid ${d.accent};">${left}</td>
  <td style="vertical-align:top;padding:0 0 0 18px;">
    ${nameBlock(d)}
    <div style="padding-top:8px;">${contactRows(d)}</div>
    ${address(d)}
    ${socialRow(d)}
    ${ctaButton(d)}
  </td>
</tr>
<tr><td colspan="2" style="padding:0;">${bottomLogo}${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
    return wrap(d, inner, 540);
  };

  // ---- Modern: red rail, logo + buttons footer ----
  TEMPLATES.modern = function (d) {
    const inner = `
<tr>
  <td style="padding:2px 0 2px 16px;border-left:3px solid ${d.accent};">
    ${d.photoUrl ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:9px;"><tr><td>${photoCell(d, 68)}</td></tr></table>` : ""}
    ${nameBlock(d, { nameSize: 18 })}
    <div style="padding-top:8px;font-family:${FONT(d)};font-size:12px;color:${B.colors.text};line-height:1.8;">${contactInline(d)}</div>
    ${address(d)}
    ${socialRow(d)}
  </td>
</tr>
<tr><td style="padding:12px 0 0;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="vertical-align:middle;padding:0 14px 0 0;">${wordmark(d, { width: 72, lockupWidth: 150 })}</td><td style="vertical-align:middle;">${ctaButton(d).replace("margin-top:12px;", "")}</td></tr></table></td></tr>
${tail(d)}`;
    return wrap(d, inner, 540);
  };

  // ---- Compact: one-liner ----
  TEMPLATES.compact = function (d) {
    const F = FONT(d);
    const bits = [];
    if (d.jobTitle) bits.push(`<span style="color:${B.colors.muted};">${esc(d.jobTitle)}</span>`);
    bits.push(`<span style="font-weight:bold;color:${d.accent};">${esc(d.company || B.companyShort)}</span>`);
    if (d.phone) bits.push(telLink(d, d.phone, { size: 12 }));
    if (d.email) bits.push(link(d, "mailto:" + d.email, d.email, { size: 12, color: B.colors.text }));
    if (d.website) bits.push(link(d, withUtm(normalizeUrl(d.website), d), d.website.replace(/^https?:\/\//i, ""), { bold: true, size: 12 }));
    const inner = `
<tr><td style="font-family:${F};font-size:15px;font-weight:bold;color:${B.colors.primary};padding:0;">${esc(d.fullName)}</td></tr>
<tr><td style="font-family:${F};font-size:12px;line-height:1.7;padding:3px 0 0;">${bits.join(DOT)}</td></tr>
<tr><td style="padding:0;">${socialRow(d)}</td></tr>
<tr><td style="padding:0;">${ctaButton(d)}</td></tr>
${tail(d)}`;
    return wrap(d, inner, 580);
  };

  // ---- Executive: serif, understated, red keyline ----
  TEMPLATES.executive = function (d) {
    const inner = `
<tr>
  ${d.photoUrl ? `<td style="vertical-align:top;padding:0 20px 0 0;">${photoCell(d, 92)}</td>` : ""}
  <td style="vertical-align:top;">
    ${nameBlock(d, { nameSize: 20 })}
    <table cellpadding="0" cellspacing="0" border="0" width="36" style="border-collapse:collapse;margin:9px 0;"><tr><td height="3" style="background-color:${d.accent};font-size:0;line-height:0;">&nbsp;</td></tr></table>
    ${contactRows(d)}
    ${address(d)}
    ${socialRow(d)}
    ${ctaButton(d)}
  </td>
</tr>
<tr><td colspan="${d.photoUrl ? 2 : 1}" style="padding:14px 0 0;">${wordmark(d, { width: 84, lockupWidth: 160 })}${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
    return wrap(d, inner, 540);
  };

  // ---- Bold: carbon header band with red underline ----
  TEMPLATES.bold = function (d) {
    const F = FONT(d);
    const headRight = (d.logoStyle || "mark") !== "text" && (d.logoStyle || "mark") !== "none"
      ? `<td style="vertical-align:middle;padding:0 0 0 16px;" align="right"><img src="https://forza-email-signatures.vercel.app/assets/brand/forza-f-mark-dark.png" alt="FP" width="44" style="display:block;border:0;width:44px;height:auto;"></td>` : "";
    const inner = `
<tr><td style="background-color:${B.colors.primary};border-bottom:3px solid ${d.accent};padding:14px 18px;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;"><tr>
    ${d.photoUrl ? `<td style="padding:0 14px 0 0;">${photoCell(d, 60)}</td>` : ""}
    <td style="vertical-align:middle;">
      <div style="font-family:${F};font-size:18px;font-weight:bold;color:#FFFFFF;">${esc(d.fullName)}</div>
      ${d.jobTitle ? `<div style="font-family:${F};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${d.accent === B.colors.primary ? "#FFFFFF" : d.accent};padding-top:4px;">${esc([d.jobTitle, d.department].filter(Boolean).join(", "))}</div>` : ""}
    </td>
    ${headRight}
  </tr></table>
</td></tr>
<tr><td style="padding:12px 2px 0;">
  ${contactRows(d)}
  ${address(d)}
  ${socialRow(d)}
  ${ctaButton(d)}
</td></tr>
${tail(d)}`;
    return wrap(d, inner, 540);
  };

  // ---- Centered: stacked, mobile-friendly ----
  TEMPLATES.centered = function (d) {
    const F = FONT(d);
    const art = d.photoUrl
      ? photoCell(d, 84).replace('style="display:block;', 'style="display:inline-block;')
      : wordmark(d, { width: 80, lockupWidth: 170 }).replace(/display:block;/g, "display:inline-block;");
    const c = (html, pad) => `<tr><td align="center" style="padding:${pad || "0"};text-align:center;">${html}</td></tr>`;
    const inner = `
${art ? c(art) : ""}
${c(`<div style="font-family:${F};font-size:18px;font-weight:bold;color:${B.colors.primary};">${esc(d.fullName)}</div>`, "10px 0 0")}
${d.jobTitle ? c(`<div style="font-family:${F};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${d.accent};">${esc([d.jobTitle, d.department].filter(Boolean).join(", "))}</div>`, "4px 0 0") : ""}
${d.company ? c(`<div style="font-family:${F};font-size:12.5px;font-weight:bold;color:${B.colors.primary};">${esc(d.company)}</div>`, "6px 0 0") : ""}
${c(`<table cellpadding="0" cellspacing="0" border="0" width="40" style="border-collapse:collapse;"><tr><td height="3" style="background-color:${d.accent};font-size:0;line-height:0;">&nbsp;</td></tr></table>`, "9px 0")}
${c(`<div style="font-family:${F};font-size:12px;color:${B.colors.text};line-height:1.9;">${contactInline(d)}</div>`)}
${c(socialRow(d).replace('style="border-collapse:collapse;', 'align="center" style="margin:0 auto;border-collapse:collapse;'), "2px 0 0")}
${c(ctaButton(d).replace('style="border-collapse:collapse;', 'align="center" style="margin:0 auto;border-collapse:collapse;'), "10px 0 0")}
${tail(d)}`;
    return wrap(d, inner, 460);
  };

  // ---- Minimal: spaced caps, text links only ----
  TEMPLATES.minimal = function (d) {
    const textLinks = SOCIALS.filter((s) => d[s.key]).map((s) =>
      link(d, withUtm(normalizeUrl(d[s.key]), d), s.name, { color: B.colors.muted, size: 12 })).join(`<span style="color:${B.colors.faint};">&nbsp;/&nbsp;</span>`);
    const cta = d.ctaText && d.ctaUrl
      ? `<tr><td style="padding:9px 0 0;">${link(d, withUtm(normalizeUrl(d.ctaUrl), d), d.ctaText + " →", { bold: true })}</td></tr>` : "";
    const book = d.bookingUrl
      ? `<tr><td style="padding:4px 0 0;">${link(d, withUtm(normalizeUrl(d.bookingUrl), d), "Book a meeting →", { bold: true, color: B.colors.primary })}</td></tr>` : "";
    const inner = `
<tr><td style="padding:0 0 10px;"><table cellpadding="0" cellspacing="0" border="0" width="180" style="border-collapse:collapse;"><tr><td height="2" style="background-color:${d.accent};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
<tr><td style="font-family:${FONT(d)};font-size:15px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:${B.colors.primary};padding:0;">${esc(d.fullName)}</td></tr>
${d.jobTitle ? `<tr><td style="font-family:${FONT(d)};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${B.colors.muted};padding:5px 0 0;">${esc([d.jobTitle, d.company].filter(Boolean).join(" · "))}</td></tr>` : ""}
<tr><td style="padding:9px 0 0;"><div style="font-family:${FONT(d)};font-size:12px;color:${B.colors.text};line-height:1.9;">${contactInline(d)}</div></td></tr>
${textLinks ? `<tr><td style="padding:7px 0 0;">${textLinks}</td></tr>` : ""}
${cta}${book}
${tail(d)}`;
    return wrap(d, inner, 540);
  };

  // ---- Corporate: letterhead — logo over a red rule, contacts right ----
  TEMPLATES.corporate = function (d) {
    const inner = `
<tr><td colspan="2" style="padding:0 0 10px;">${wordmark(d, { width: 84, lockupWidth: 190 })}</td></tr>
<tr><td colspan="2" style="padding:0 0 14px;"><table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;"><tr><td height="3" style="background-color:${d.accent};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
<tr>
  <td style="vertical-align:top;padding:0 24px 0 0;">
    ${d.photoUrl ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-bottom:9px;"><tr><td>${photoCell(d, 64)}</td></tr></table>` : ""}
    ${nameBlock(d)}
  </td>
  <td style="vertical-align:top;text-align:right;" align="right">
    ${contactRows(d).replace("text-align:left", "text-align:right")}
    ${address(d)}
  </td>
</tr>
<tr>
  <td style="padding:6px 0 0;">${socialRow(d)}</td>
  <td align="right" style="text-align:right;">${ctaButton(d).replace('style="border-collapse:collapse;', 'align="right" style="border-collapse:collapse;')}</td>
</tr>
${tail(d, 2)}`;
    return wrap(d, inner, 580);
  };

  window.renderSignature = function (d) {
    const fn = TEMPLATES[d.template] || TEMPLATES.corporate;
    return fn(d).replace(/\n\s*/g, "");
  };
})();
