/* Forza signature builder — form state, live preview, export, team mode. */
(function () {
  const B = FORZA_BRAND;
  const STORAGE_KEY = "forza-signature-draft-v1";

  const FIELDS = [
    "fullName", "jobTitle", "department", "company", "phone", "mobile",
    "email", "website", "address", "photoUrl", "logoUrl",
    "linkedin", "twitter", "facebook", "instagram", "youtube",
    "ctaText", "ctaUrl", "bannerText", "bannerUrl", "bookingUrl",
    "utmCampaign", "customDisclaimer",
  ];
  const CHECKBOXES = ["monoSocial", "utmEnabled", "qrEnabled"];
  const PRESETS_KEY = "forza-signature-presets-v1";

  const $ = (id) => document.getElementById(id);

  const state = {
    template: "classic",
    accent: B.colors.accent,
    disclaimer: "none",
  };
  FIELDS.forEach((f) => (state[f] = $(f) ? $(f).value : ""));
  CHECKBOXES.forEach((f) => (state[f] = false));

  // ---------- persistence ----------
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      Object.assign(state, JSON.parse(raw));
      // Drafts saved under an older palette get snapped back to brand colors.
      if (!B.accentChoices.some((c) => c.value === state.accent)) {
        state.accent = B.colors.accent;
      }
    } catch (e) {}
  }

  // ---------- preview ----------
  function demoData() {
    // Fill blanks with sample data so the preview never looks broken.
    const d = Object.assign({}, state);
    if (!d.fullName) d.fullName = "Alex Rivera";
    if (!d.jobTitle) d.jobTitle = "Account Executive";
    if (!d.email) d.email = "alex@forzapayments.com";
    if (!d.phone) d.phone = B.phone;
    if (!d.website) d.website = B.websiteDisplay;
    return d;
  }

  function isPreviewDemo() {
    return !state.fullName;
  }

  function render() {
    $("signaturePreview").innerHTML = renderSignature(demoData());
  }

  function syncToForm() {
    FIELDS.forEach((f) => { if ($(f)) $(f).value = state[f] || ""; });
    CHECKBOXES.forEach((f) => { if ($(f)) $(f).checked = !!state[f]; });
    $("disclaimer").value = state.disclaimer;
    document.querySelectorAll("#templatePicker button").forEach((b) =>
      b.classList.toggle("active", b.dataset.template === state.template));
    document.querySelectorAll(".accent-swatch").forEach((b) =>
      b.classList.toggle("active", b.dataset.color === state.accent));
    $("customDisclaimerWrap").classList.toggle("hidden", state.disclaimer !== "custom");
    $("utmCampaignWrap").classList.toggle("hidden", !state.utmEnabled);
  }

  // ---------- presets ----------
  function getPresets() {
    try { return JSON.parse(localStorage.getItem(PRESETS_KEY)) || {}; } catch (e) { return {}; }
  }
  function setPresets(p) {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(p));
  }
  function refreshPresetList() {
    const sel = $("presetSelect");
    const current = sel.value;
    sel.innerHTML = '<option value="">— load a preset —</option>' +
      Object.keys(getPresets()).sort().map((n) => `<option>${n.replace(/[&<>"]/g, "")}</option>`).join("");
    sel.value = current;
  }

  // Share links: signature state packed into the URL hash as base64 JSON.
  function encodeShare() {
    const json = JSON.stringify(state);
    return location.origin + location.pathname + "#s=" +
      btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decodeShare() {
    const m = location.hash.match(/#s=([A-Za-z0-9_-]+)/);
    if (!m) return false;
    try {
      const b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
      const data = JSON.parse(decodeURIComponent(escape(atob(b64))));
      Object.assign(state, data);
      history.replaceState(null, "", location.pathname);
      return true;
    } catch (e) { return false; }
  }

  // ---------- toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // ---------- export ----------
  function currentHtml(data) {
    return renderSignature(data || demoData());
  }

  async function copyRich() {
    const html = currentHtml();
    const plain = $("signaturePreview").innerText;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
    } catch (e) {
      // Fallback: select the rendered preview and copy.
      const node = $("signaturePreview");
      const range = document.createRange();
      range.selectNodeContents(node);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("copy");
      sel.removeAllRanges();
    }
    toast(isPreviewDemo()
      ? "Copied (sample data — fill in your name first!)"
      : "Signature copied — paste it into your email settings");
  }

  async function copyHtmlSource() {
    await navigator.clipboard.writeText(currentHtml());
    toast("HTML source copied");
  }

  function docWrap(bodyHtml, title) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title></head><body style="margin:20px;background:#ffffff;">${bodyHtml}</body></html>`;
  }

  function downloadFile(name, content) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/html" }));
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ---------- team mode ----------
  const CSV_HEADERS = ["fullName", "jobTitle", "department", "email", "phone", "mobile"];

  function parseCsv(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') inQuotes = false;
        else field += c;
      } else if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); field = "";
        if (row.some((v) => v.trim() !== "")) rows.push(row);
        row = [];
      } else field += c;
    }
    row.push(field);
    if (row.some((v) => v.trim() !== "")) rows.push(row);
    return rows;
  }

  function batchGenerate(csvText) {
    const rows = parseCsv(csvText);
    if (rows.length < 2) throw new Error("CSV needs a header row plus at least one person.");
    const headers = rows[0].map((h) => h.trim());
    const people = rows.slice(1).map((r) => {
      const p = {};
      headers.forEach((h, i) => (p[h] = (r[i] || "").trim()));
      return p;
    }).filter((p) => p.fullName);
    if (!people.length) throw new Error("No rows with a fullName found.");

    const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
    const sections = people.map((p, i) => {
      const d = Object.assign({}, state, p);
      return `<div style="border:1px solid #E2E2E2;border-radius:10px;margin:0 0 24px;overflow:hidden;">
<div style="background:#1C1C1C;color:#fff;padding:10px 16px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">
${esc(p.fullName)} <button onclick="copySig(${i})" style="float:right;background:#D00F10;color:#fff;border:0;border-radius:4px;padding:4px 12px;cursor:pointer;font-weight:bold;">Copy</button></div>
<div id="sig-${i}" style="padding:20px;background:#fff;">${currentHtml(d)}</div></div>`;
    });

    const script = `<scr` + `ipt>
function copySig(i){var n=document.getElementById('sig-'+i);var r=document.createRange();r.selectNodeContents(n);var s=window.getSelection();s.removeAllRanges();s.addRange(r);document.execCommand('copy');s.removeAllRanges();alert('Signature copied for '+n.previousElementSibling.textContent.replace('Copy','').trim());}
</scr` + `ipt>`;

    const page = docWrap(
      `<h1 style="font-family:Arial,sans-serif;color:#1C1C1C;">Forza Payments — Team Signatures</h1>
<p style="font-family:Arial,sans-serif;color:#3D4145;">Send each person this file (or their section). They click <b>Copy</b>, then paste into their email client's signature settings.</p>
${sections.join("\n")}${script}`,
      "Forza Team Signatures"
    );
    downloadFile("forza-team-signatures.html", page);
    return people.length;
  }

  // ---------- wire up ----------
  function bind() {
    FIELDS.forEach((f) => {
      const el = $(f);
      if (!el) return;
      el.addEventListener("input", () => { state[f] = el.value; render(); save(); });
    });
    CHECKBOXES.forEach((f) => {
      const el = $(f);
      el.addEventListener("change", () => {
        state[f] = el.checked;
        if (f === "utmEnabled") $("utmCampaignWrap").classList.toggle("hidden", !el.checked);
        render(); save();
      });
    });

    $("disclaimer").addEventListener("change", (e) => {
      state.disclaimer = e.target.value;
      $("customDisclaimerWrap").classList.toggle("hidden", state.disclaimer !== "custom");
      render(); save();
    });

    document.querySelectorAll("#templatePicker button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.template = btn.dataset.template;
        syncToForm(); render(); save();
      });
    });

    // Presets
    $("presetSaveBtn").addEventListener("click", () => {
      const name = prompt("Name this signature preset:", $("presetSelect").value || "My signature");
      if (!name) return;
      const p = getPresets();
      p[name] = Object.assign({}, state);
      setPresets(p);
      refreshPresetList();
      $("presetSelect").value = name;
      $("presetStatus").textContent = `✅ Saved "${name}"`;
    });
    $("presetSelect").addEventListener("change", (e) => {
      const p = getPresets()[e.target.value];
      if (!p) return;
      Object.assign(state, p);
      syncToForm(); render(); save();
      $("presetStatus").textContent = `Loaded "${e.target.value}"`;
    });
    $("presetDeleteBtn").addEventListener("click", () => {
      const name = $("presetSelect").value;
      if (!name || !confirm(`Delete preset "${name}"?`)) return;
      const p = getPresets();
      delete p[name];
      setPresets(p);
      refreshPresetList();
      $("presetStatus").textContent = `Deleted "${name}"`;
    });
    $("shareLinkBtn").addEventListener("click", async () => {
      await navigator.clipboard.writeText(encodeShare());
      toast("Share link copied — anyone who opens it sees this signature pre-filled");
    });

    // Department presets
    const dep = $("departmentPreset");
    Object.entries(B.departments).forEach(([key, v]) => {
      const o = document.createElement("option");
      o.value = key;
      o.textContent = v.label;
      dep.appendChild(o);
    });
    dep.addEventListener("change", () => {
      const v = B.departments[dep.value];
      if (!v || !dep.value) return;
      ["department", "phone", "address"].forEach((f) => {
        if (v[f]) { state[f] = v[f]; }
      });
      syncToForm(); render(); save();
    });

    // Banner gallery
    const gallery = $("bannerGallery");
    B.banners.forEach((b) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "banner-chip";
      btn.textContent = b.label;
      btn.title = b.text;
      btn.addEventListener("click", () => {
        state.bannerText = b.text;
        state.bannerUrl = b.url;
        syncToForm(); render(); save();
      });
      gallery.appendChild(btn);
    });
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "banner-chip banner-chip-clear";
    clearBtn.textContent = "✕ none";
    clearBtn.addEventListener("click", () => {
      state.bannerText = "";
      state.bannerUrl = "";
      syncToForm(); render(); save();
    });
    gallery.appendChild(clearBtn);

    // Accent swatches from brand config.
    const picker = $("accentPicker");
    B.accentChoices.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "accent-swatch";
      b.dataset.color = c.value;
      b.title = c.name;
      b.style.background = c.value;
      b.addEventListener("click", () => { state.accent = c.value; syncToForm(); render(); save(); });
      picker.appendChild(b);
    });

    $("darkToggle").addEventListener("click", (e) => {
      $("emailMock").classList.toggle("dark");
      e.target.classList.toggle("active");
    });
    $("mobileToggle").addEventListener("click", (e) => {
      $("emailMock").classList.toggle("mobile");
      e.target.classList.toggle("active");
    });

    $("copyRichBtn").addEventListener("click", copyRich);
    $("copyHtmlBtn").addEventListener("click", copyHtmlSource);
    $("downloadBtn").addEventListener("click", () => {
      const name = (state.fullName || "forza").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      downloadFile(`${name}-signature.html`, docWrap(currentHtml(), "Forza Email Signature"));
      toast("Signature file downloaded");
    });
    $("resetBtn").addEventListener("click", () => {
      if (!confirm("Clear the form and start over?")) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });

    $("csvTemplateBtn").addEventListener("click", () => {
      const sample = CSV_HEADERS.join(",") + "\nAlex Rivera,Account Executive,Merchant Services,alex@forzapayments.com,(888) 302-3401,(253) 555-0100\n";
      downloadFile("forza-team-roster.csv", sample);
    });
    $("csvUpload").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const n = batchGenerate(reader.result);
          $("csvStatus").textContent = `✅ Generated signatures for ${n} people — check your downloads.`;
        } catch (err) {
          $("csvStatus").textContent = "⚠️ " + err.message;
        }
        e.target.value = "";
      };
      reader.readAsText(file);
    });
  }

  load();
  decodeShare(); // a #s= share link overrides the local draft
  // Handoff from meetings.html: #booking=<url> pre-fills the booking button.
  const bookingHash = location.hash.match(/#booking=(.+)/);
  if (bookingHash) {
    state.bookingUrl = decodeURIComponent(bookingHash[1]);
    history.replaceState(null, "", location.pathname);
  }
  bind();
  refreshPresetList();
  syncToForm();
  render();
  save();
})();
