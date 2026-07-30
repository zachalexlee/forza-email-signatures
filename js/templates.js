/*
 * Signature templates.
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

  function link(d, href, text, opts = {}) {
    const color = opts.color || d.accent;
    const weight = opts.bold ? "font-weight:bold;" : "";
    return `<a href="${esc(href)}" target="_blank" style="color:${color};text-decoration:none;${weight}font-family:${FONT(d)};font-size:${opts.size || 13}px;">${esc(text)}</a>`;
  }

  // Letter-badge social icons: pure HTML/CSS, so they render without hosted images.
  const SOCIALS = [
    { key: "linkedin", label: "in", name: "LinkedIn", bg: "#0A66C2" },
    { key: "twitter", label: "𝕏", name: "X (Twitter)", bg: "#000000" },
    { key: "facebook", label: "f", name: "Facebook", bg: "#1877F2" },
    { key: "instagram", label: "ig", name: "Instagram", bg: "#C13584" },
    { key: "youtube", label: "▶", name: "YouTube", bg: "#FF0000" },
  ];

  function socialRow(d) {
    const cells = SOCIALS.filter((s) => d[s.key]).map((s) => {
      const href = withUtm(normalizeUrl(d[s.key]), d);
      const bg = d.monoSocial ? d.accent : s.bg;
      return `<td style="padding:0 6px 0 0;"><a href="${esc(href)}" target="_blank" title="${s.name}" style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;background-color:${bg};color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;text-decoration:none;border-radius:4px;">${s.label}</a></td>`;
    });
    if (!cells.length) return "";
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:8px;"><tr>${cells.join("")}</tr></table>`;
  }

  function wordmark(d, opts = {}) {
    const logoUrl = d.logoUrl || B.logoUrl;
    if (logoUrl) {
      return `<a href="${esc(withUtm(normalizeUrl(d.website || B.website), d))}" target="_blank"><img src="${esc(logoUrl)}" alt="${esc(B.companyName)}" width="${opts.width || 120}" style="display:block;border:0;max-width:${opts.width || 120}px;height:auto;"></a>`;
    }
    // Text wordmark fallback — renders everywhere.
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:${opts.big ? 24 : 20}px;font-weight:bold;color:${B.colors.primary};letter-spacing:1px;">FORZA</td></tr><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;color:${d.accent};letter-spacing:4px;">PAYMENTS</td></tr></table>`;
  }

  function photoCell(d, size) {
    if (!d.photoUrl) return "";
    return `<img src="${esc(normalizeUrl(d.photoUrl))}" alt="${esc(d.fullName)}" width="${size}" height="${size}" style="display:block;border-radius:50%;border:0;width:${size}px;height:${size}px;object-fit:cover;">`;
  }

  function ctaButton(d) {
    const cells = [];
    if (d.ctaText && d.ctaUrl) {
      cells.push(`<td style="background-color:${d.accent};border-radius:4px;"><a href="${esc(withUtm(normalizeUrl(d.ctaUrl), d))}" target="_blank" style="display:inline-block;padding:7px 16px;font-family:${FONT(d)};font-size:13px;font-weight:bold;color:#FFFFFF;text-decoration:none;">${esc(d.ctaText)}</a></td>`);
    }
    if (d.bookingUrl) {
      const sep = cells.length ? `<td style="width:8px;font-size:0;">&nbsp;</td>` : "";
      cells.push(`${sep}<td style="background-color:${B.colors.primary};border-radius:4px;"><a href="${esc(withUtm(normalizeUrl(d.bookingUrl), d))}" target="_blank" style="display:inline-block;padding:7px 16px;font-family:${FONT(d)};font-size:13px;font-weight:bold;color:#FFFFFF;text-decoration:none;">&#128197; Book a Meeting</a></td>`);
    }
    if (!cells.length) return "";
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:10px;"><tr>${cells.join("")}</tr></table>`;
  }

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
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:12px;"><tr><td style="padding:0 10px 0 0;"><img src="${esc(src)}" alt="Scan to save contact" width="66" height="66" style="display:block;border:0;width:66px;height:66px;"></td><td style="font-family:${FONT(d)};font-size:11px;color:${B.colors.muted};">Scan to save<br>my contact</td></tr></table>`;
  }

  function bannerBlock(d) {
    if (!d.bannerText) return "";
    const inner = `<span style="font-family:${FONT(d)};font-size:13px;font-weight:bold;color:${B.colors.primary};">${esc(d.bannerText)}</span>`;
    const content = d.bannerUrl
      ? `<a href="${esc(withUtm(normalizeUrl(d.bannerUrl), d))}" target="_blank" style="text-decoration:none;">${inner} <span style="color:${d.accent};font-family:${FONT(d)};font-size:13px;font-weight:bold;">&rarr;</span></a>`
      : inner;
    return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:12px;"><tr><td style="background-color:${B.colors.light};border-left:4px solid ${d.accent};padding:10px 14px;">${content}</td></tr></table>`;
  }

  function disclaimerBlock(d) {
    const text = d.disclaimer === "custom" ? d.customDisclaimer : B.disclaimers[d.disclaimer];
    if (!text) return "";
    return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:12px;"><tr><td style="font-family:${FONT(d)};font-size:10px;line-height:14px;color:${B.colors.muted};border-top:1px solid #E2E2E2;padding-top:8px;">${esc(text)}</td></tr></table>`;
  }

  function contactLines(d, opts = {}) {
    const sep = `<span style="color:${B.colors.muted};">&nbsp;|&nbsp;</span>`;
    const size = opts.size || 13;
    const line = (label, html) =>
      `<td style="font-family:${FONT(d)};font-size:${size}px;line-height:20px;color:${B.colors.text};padding:0;">${html}</td>`;
    const rows = [];
    const phones = [];
    if (d.phone) phones.push(`<span style="color:${B.colors.muted};">P:</span> ${link(d, "tel:" + d.phone.replace(/[^+\d]/g, ""), d.phone, { color: B.colors.text })}`);
    if (d.mobile) phones.push(`<span style="color:${B.colors.muted};">M:</span> ${link(d, "tel:" + d.mobile.replace(/[^+\d]/g, ""), d.mobile, { color: B.colors.text })}`);
    if (phones.length) rows.push(line("phones", phones.join(sep)));
    const web = [];
    if (d.email) web.push(link(d, "mailto:" + d.email, d.email));
    if (d.website) web.push(link(d, withUtm(normalizeUrl(d.website), d), d.website.replace(/^https?:\/\//i, "")));
    if (web.length) rows.push(line("web", web.join(sep)));
    if (d.address) rows.push(line("address", `<span style="color:${B.colors.muted};">${esc(d.address)}</span>`));
    return rows.map((r) => `<tr>${r}</tr>`).join("");
  }

  function nameBlock(d, opts = {}) {
    const nameSize = opts.nameSize || 17;
    let html = `<tr><td style="font-family:${FONT(d)};font-size:${nameSize}px;font-weight:bold;color:${B.colors.primary};padding:0;line-height:${nameSize + 5}px;">${esc(d.fullName)}</td></tr>`;
    const sub = [d.jobTitle, d.department].filter(Boolean).join(", ");
    if (sub) html += `<tr><td style="font-family:${FONT(d)};font-size:13px;color:${d.accent};font-weight:bold;padding:2px 0 0;">${esc(sub)}</td></tr>`;
    if (d.company) html += `<tr><td style="font-family:${FONT(d)};font-size:13px;color:${B.colors.text};padding:1px 0 0;">${esc(d.company)}</td></tr>`;
    return html;
  }

  function wrap(d, inner, width) {
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:${width}px;">${inner}</table>`;
  }

  const TEMPLATES = {
    classic(d) {
      const left = d.photoUrl
        ? photoCell(d, 84)
        : wordmark(d, { width: 110 });
      const inner = `
<tr>
  <td valign="top" style="padding:0 16px 0 0;border-right:2px solid ${d.accent};">${left}</td>
  <td valign="top" style="padding:0 0 0 16px;">
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      ${nameBlock(d)}
      <tr><td style="padding:6px 0 0;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactLines(d)}</table></td></tr>
      <tr><td style="padding:0;">${socialRow(d)}</td></tr>
      <tr><td style="padding:0;">${ctaButton(d)}</td></tr>
    </table>
  </td>
</tr>
<tr><td colspan="2" style="padding:0;">${d.photoUrl ? `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:12px;"><tr><td>${wordmark(d, { width: 110 })}</td></tr></table>` : ""}${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
      return wrap(d, inner, 520);
    },

    modern(d) {
      const inner = `
<tr>
  <td style="padding:0 0 0 14px;border-left:4px solid ${d.accent};">
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      ${d.photoUrl ? `<tr><td style="padding:0 0 8px;">${photoCell(d, 72)}</td></tr>` : ""}
      ${nameBlock(d, { nameSize: 18 })}
      <tr><td style="padding:6px 0 0;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactLines(d)}</table></td></tr>
      <tr><td style="padding:0;">${socialRow(d)}</td></tr>
    </table>
  </td>
</tr>
<tr><td style="padding:10px 0 0;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="padding:0 12px 0 0;">${wordmark(d, { width: 100 })}</td><td>${ctaButton(d)}</td></tr></table></td></tr>
<tr><td style="padding:0;">${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
      return wrap(d, inner, 520);
    },

    compact(d) {
      const sep = `<span style="color:${B.colors.muted};">&nbsp;&bull;&nbsp;</span>`;
      const bits = [];
      if (d.jobTitle) bits.push(`<span style="color:${B.colors.text};">${esc(d.jobTitle)}</span>`);
      bits.push(`<span style="font-weight:bold;color:${d.accent};">${esc(d.company || B.companyName)}</span>`);
      if (d.phone) bits.push(link(d, "tel:" + d.phone.replace(/[^+\d]/g, ""), d.phone, { color: B.colors.text }));
      if (d.website) bits.push(link(d, withUtm(normalizeUrl(d.website), d), d.website.replace(/^https?:\/\//i, "")));
      const inner = `
<tr><td style="font-family:${FONT(d)};font-size:15px;font-weight:bold;color:${B.colors.primary};padding:0;">${esc(d.fullName)}</td></tr>
<tr><td style="font-family:${FONT(d)};font-size:12px;line-height:18px;padding:2px 0 0;">${bits.join(sep)}</td></tr>
<tr><td style="padding:0;">${socialRow(d)}</td></tr>
<tr><td style="padding:0;">${ctaButton(d)}</td></tr>
<tr><td style="padding:0;">${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
      return wrap(d, inner, 560);
    },

    executive(d) {
      const inner = `
<tr>
  ${d.photoUrl ? `<td valign="top" style="padding:0 18px 0 0;">${photoCell(d, 96)}</td>` : ""}
  <td valign="top">
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      ${nameBlock(d, { nameSize: 20 })}
      <tr><td style="padding:8px 0;"><table cellpadding="0" cellspacing="0" border="0" width="40" style="border-collapse:collapse;"><tr><td height="2" style="background-color:${d.accent};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
      <tr><td style="padding:0;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactLines(d)}</table></td></tr>
      <tr><td style="padding:0;">${socialRow(d)}</td></tr>
      <tr><td style="padding:0;">${ctaButton(d)}</td></tr>
    </table>
  </td>
</tr>
<tr><td colspan="${d.photoUrl ? 2 : 1}" style="padding:12px 0 0;">${wordmark(d, { width: 120 })}${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
      return wrap(d, inner, 540);
    },
  };

  /* ---- second wave of templates ---- */

  TEMPLATES.bold = function (d) {
    const inner = `
<tr><td style="background-color:${B.colors.primary};padding:14px 18px;">
  <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>
    ${d.photoUrl ? `<td style="padding:0 14px 0 0;">${photoCell(d, 64)}</td>` : ""}
    <td>
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr><td style="font-family:${FONT(d)};font-size:19px;font-weight:bold;color:#FFFFFF;padding:0;">${esc(d.fullName)}</td></tr>
        ${d.jobTitle ? `<tr><td style="font-family:${FONT(d)};font-size:13px;font-weight:bold;color:${d.accent === B.colors.primary ? "#FFFFFF" : d.accent};padding:3px 0 0;">${esc([d.jobTitle, d.department].filter(Boolean).join(", "))}</td></tr>` : ""}
      </table>
    </td>
  </tr></table>
</td></tr>
<tr><td style="border-left:4px solid ${d.accent};padding:12px 0 0 14px;">
  <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactLines(d)}</table>
  ${socialRow(d)}
  ${ctaButton(d)}
</td></tr>
<tr><td style="padding:12px 0 0;">${wordmark(d, { width: 110 })}${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
    return wrap(d, inner, 520);
  };

  TEMPLATES.centered = function (d) {
    const center = (html) => `<tr><td align="center" style="padding:0;text-align:center;">${html}</td></tr>`;
    const inner = `
${center(d.photoUrl ? photoCell(d, 84).replace('style="display:block;', 'style="display:inline-block;') : wordmark(d, { width: 130 }).replace('style="display:block;', 'style="display:inline-block;'))}
<tr><td align="center" style="font-family:${FONT(d)};font-size:18px;font-weight:bold;color:${B.colors.primary};padding:10px 0 0;text-align:center;">${esc(d.fullName)}</td></tr>
${d.jobTitle || d.department ? `<tr><td align="center" style="font-family:${FONT(d)};font-size:13px;font-weight:bold;color:${d.accent};padding:2px 0 0;text-align:center;">${esc([d.jobTitle, d.department].filter(Boolean).join(", "))}</td></tr>` : ""}
${d.company ? `<tr><td align="center" style="font-family:${FONT(d)};font-size:13px;color:${B.colors.text};padding:1px 0 0;text-align:center;">${esc(d.company)}</td></tr>` : ""}
<tr><td align="center" style="padding:8px 0 0;"><table cellpadding="0" cellspacing="0" border="0" width="44" style="border-collapse:collapse;"><tr><td height="2" style="background-color:${d.accent};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
<tr><td align="center" style="padding:6px 0 0;text-align:center;"><table align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">${contactLines(d)}</table></td></tr>
<tr><td align="center" style="padding:0;text-align:center;">${socialRow(d).replace('style="border-collapse:collapse;', 'align="center" style="margin:8px auto 0;border-collapse:collapse;')}</td></tr>
<tr><td align="center" style="padding:0;text-align:center;">${ctaButton(d).replace('style="border-collapse:collapse;', 'align="center" style="margin:10px auto 0;border-collapse:collapse;')}</td></tr>
<tr><td style="padding:0;">${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
    return wrap(d, inner, 440);
  };

  TEMPLATES.minimal = function (d) {
    // Understated: thin rule, spaced caps, text links only — no badges or buttons.
    const textLinks = SOCIALS.filter((s) => d[s.key]).map((s) =>
      link(d, withUtm(normalizeUrl(d[s.key]), d), s.name, { color: B.colors.muted, size: 12 })).join(`<span style="color:${B.colors.muted};">&nbsp;/&nbsp;</span>`);
    const cta = d.ctaText && d.ctaUrl
      ? `<tr><td style="padding:8px 0 0;">${link(d, withUtm(normalizeUrl(d.ctaUrl), d), d.ctaText + " →", { bold: true })}</td></tr>` : "";
    const book = d.bookingUrl
      ? `<tr><td style="padding:4px 0 0;">${link(d, withUtm(normalizeUrl(d.bookingUrl), d), "Book a meeting →", { bold: true, color: B.colors.primary })}</td></tr>` : "";
    const inner = `
<tr><td style="padding:0 0 10px;"><table cellpadding="0" cellspacing="0" border="0" width="180" style="border-collapse:collapse;"><tr><td height="1" style="background-color:${B.colors.primary};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
<tr><td style="font-family:${FONT(d)};font-size:15px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:${B.colors.primary};padding:0;">${esc(d.fullName)}</td></tr>
${d.jobTitle ? `<tr><td style="font-family:${FONT(d)};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${B.colors.muted};padding:4px 0 0;">${esc([d.jobTitle, d.company].filter(Boolean).join(" · "))}</td></tr>` : ""}
<tr><td style="padding:8px 0 0;"><table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactLines(d, { size: 12 })}</table></td></tr>
${textLinks ? `<tr><td style="padding:6px 0 0;">${textLinks}</td></tr>` : ""}
${cta}${book}
<tr><td style="padding:0;">${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
    return wrap(d, inner, 520);
  };

  TEMPLATES.corporate = function (d) {
    const inner = `
<tr><td colspan="2" style="padding:0 0 10px;">${wordmark(d, { width: 140 })}</td></tr>
<tr><td colspan="2" style="padding:0 0 12px;"><table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;"><tr><td height="2" style="background-color:${d.accent};font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
<tr>
  <td valign="top" style="padding:0 20px 0 0;">
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      ${d.photoUrl ? `<tr><td style="padding:0 0 8px;">${photoCell(d, 68)}</td></tr>` : ""}
      ${nameBlock(d)}
    </table>
  </td>
  <td valign="top" align="right" style="text-align:right;">
    <table align="right" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${contactLines(d)}</table>
  </td>
</tr>
<tr>
  <td style="padding:4px 0 0;">${socialRow(d)}</td>
  <td align="right" style="text-align:right;">${ctaButton(d).replace('style="border-collapse:collapse;', 'align="right" style="border-collapse:collapse;')}</td>
</tr>
<tr><td colspan="2" style="padding:0;">${qrBlock(d)}${bannerBlock(d)}${disclaimerBlock(d)}</td></tr>`;
    return wrap(d, inner, 560);
  };

  window.renderSignature = function (d) {
    const fn = TEMPLATES[d.template] || TEMPLATES.classic;
    return fn(d).replace(/\n\s*/g, "");
  };
})();
