/* Forza Payments — meeting booker popup widget.
 *
 * On any website:
 *   <script src="https://forza-email-signatures.vercel.app/embed.js" data-user="your-slug"></script>
 * shows a floating "Book a Meeting" button that opens the scheduling page in a
 * popup. Options:
 *   data-mode="float" (default) | "none"  — "none" adds no button; use your own
 *   data-label="Book a Meeting"           — floating button text
 * Any element with data-forza-booker="slug" opens the popup on click, and
 * window.ForzaBooker.open(slugOrUrl) / .close() work from your own scripts.
 */
(function () {
  "use strict";
  var script = document.currentScript;
  var cfg = {
    base: (script && script.getAttribute("data-base")) ||
      (script && script.src ? script.src.replace(/\/embed\.js.*$/, "") : ""),
    user: script && script.getAttribute("data-user"),
    mode: (script && script.getAttribute("data-mode")) || "float",
    label: (script && script.getAttribute("data-label")) || "Book a Meeting",
  };
  var overlay = null;

  function onEsc(e) { if (e.key === "Escape") close(); }
  function close() {
    if (overlay) { overlay.remove(); overlay = null; }
    document.removeEventListener("keydown", onEsc);
  }

  function open(target) {
    close();
    var url = /^https?:\/\//i.test(target || "")
      ? target
      : cfg.base + "/book.html?u=" + encodeURIComponent(target || cfg.user || "");
    url += (url.indexOf("?") > -1 ? "&" : "?") + "embed=1";

    overlay = document.createElement("div");
    overlay.setAttribute("style",
      "position:fixed;inset:0;background:rgba(17,17,17,.62);z-index:999999;" +
      "display:flex;align-items:center;justify-content:center;padding:20px;");
    var box = document.createElement("div");
    box.setAttribute("style",
      "position:relative;width:100%;max-width:760px;height:min(86vh,720px);" +
      "background:#fff;border-radius:8px;border-top:4px solid #F00411;" +
      "overflow:hidden;box-shadow:0 16px 40px rgba(17,17,17,.35);");
    var x = document.createElement("button");
    x.innerHTML = "&#10005;";
    x.setAttribute("aria-label", "Close");
    x.setAttribute("style",
      "position:absolute;top:10px;right:10px;width:32px;height:32px;border:0;" +
      "border-radius:4px;background:#111111;color:#fff;font-size:14px;" +
      "cursor:pointer;z-index:2;");
    x.onclick = close;
    var frame = document.createElement("iframe");
    frame.src = url;
    frame.title = "Book a meeting";
    frame.setAttribute("style", "width:100%;height:100%;border:0;display:block;");
    box.appendChild(x);
    box.appendChild(frame);
    overlay.appendChild(box);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", onEsc);
    document.body.appendChild(overlay);
  }

  // Delegated clicks: any element with data-forza-booker opens the popup.
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest && e.target.closest("[data-forza-booker]");
    if (t) { e.preventDefault(); open(t.getAttribute("data-forza-booker") || cfg.user); }
  });

  if (cfg.mode === "float") {
    var mount = function () {
      var btn = document.createElement("button");
      btn.textContent = cfg.label;
      btn.setAttribute("style",
        "position:fixed;right:24px;bottom:24px;z-index:999998;background:#F00411;" +
        "color:#fff;border:0;border-radius:4px;padding:14px 22px;" +
        "font:700 15px/1 'Rajdhani','Arial Narrow',Arial,sans-serif;" +
        "text-transform:uppercase;letter-spacing:.06em;cursor:pointer;" +
        "box-shadow:0 6px 20px rgba(240,4,17,.25);");
      btn.onmouseenter = function () { btn.style.background = "#C9000B"; };
      btn.onmouseleave = function () { btn.style.background = "#F00411"; };
      btn.onclick = function () { open(cfg.user); };
      document.body.appendChild(btn);
    };
    if (document.body) mount();
    else document.addEventListener("DOMContentLoaded", mount);
  }

  window.ForzaBooker = { open: open, close: close };
})();
