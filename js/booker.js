/* Shared helpers for the Forza meeting booker (book.html + meetings.html).
   Talks to Supabase's REST API directly — no client library needed. */
(function () {
  const A = BOOKER_API;

  async function api(path, opts = {}) {
    const res = await fetch(A.url + "/rest/v1/" + path, Object.assign({}, opts, {
      headers: Object.assign({
        apikey: A.key,
        Authorization: "Bearer " + A.key,
        "Content-Type": "application/json",
      }, opts.headers || {}),
    }));
    if (!res.ok) {
      const body = await res.text();
      const err = new Error("API " + res.status + ": " + body);
      err.status = res.status;
      err.body = body;
      throw err;
    }
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null; // 201 Created often has an empty body
  }

  /* ---- timezone math: convert a wall-clock time in TZ to a UTC Date ---- */
  function tzOffsetMs(tz, utcDate) {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    const parts = {};
    dtf.formatToParts(utcDate).forEach((p) => (parts[p.type] = p.value));
    const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day,
      parts.hour === "24" ? 0 : parts.hour, parts.minute, parts.second);
    return asUtc - utcDate.getTime();
  }

  function zonedToUtc(dateStr, timeStr, tz) {
    // two-pass: guess, measure the zone offset at the guess, correct
    let guess = new Date(`${dateStr}T${timeStr}:00Z`);
    for (let i = 0; i < 2; i++) {
      guess = new Date(Date.parse(`${dateStr}T${timeStr}:00Z`) - tzOffsetMs(tz, guess));
    }
    return guess;
  }

  function fmtInTz(date, tz, opts) {
    return new Intl.DateTimeFormat("en-US", Object.assign({ timeZone: tz }, opts)).format(date);
  }

  function dateStrInTz(date, tz) {
    const p = {};
    new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(date).forEach((x) => (p[x.type] = x.value));
    return `${p.year}-${p.month}-${p.day}`;
  }

  function weekdayInTz(date, tz) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      .indexOf(fmtInTz(date, tz, { weekday: "short" }));
  }

  /* ---- slot computation ---- */
  // availability: {"1":[["09:00","16:00"]], ...} keys are 0(Sun)..6(Sat), times in A.timeZone
  function computeSlots(booker, bookedSet, days = 14) {
    const out = [];
    const now = Date.now();
    const step = booker.slot_minutes * 60 * 1000;
    for (let dayOffset = 0; dayOffset < days; dayOffset++) {
      const probe = new Date(now + dayOffset * 86400000);
      const dstr = dateStrInTz(probe, A.timeZone);
      const dow = String(weekdayInTz(probe, A.timeZone));
      const windows = (booker.availability || {})[dow] || [];
      const slots = [];
      windows.forEach(([startT, endT]) => {
        const startMs = zonedToUtc(dstr, startT, A.timeZone).getTime();
        const endMs = zonedToUtc(dstr, endT, A.timeZone).getTime();
        for (let t = startMs; t + step <= endMs; t += step) {
          if (t < now + 30 * 60 * 1000) continue; // 30 min lead time
          if (bookedSet.has(new Date(t).toISOString())) continue;
          slots.push(new Date(t));
        }
      });
      if (slots.length) out.push({ dateStr: dstr, date: new Date(slots[0]), slots });
    }
    return out;
  }

  function icsFor(title, description, start, end, organizerName) {
    const f = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Forza Payments//Meeting Booker//EN",
      "BEGIN:VEVENT",
      "UID:" + f(start) + "@forza-email-signatures",
      "DTSTAMP:" + f(new Date()),
      "DTSTART:" + f(start),
      "DTEND:" + f(end),
      "SUMMARY:" + title,
      "DESCRIPTION:" + description.replace(/\n/g, "\\n"),
      organizerName ? "ORGANIZER;CN=" + organizerName + ":mailto:noreply@forzapayments.com" : "",
      "END:VEVENT", "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");
  }

  function download(name, content, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: type || "text/plain" }));
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  window.Booker = { api, zonedToUtc, fmtInTz, dateStrInTz, computeSlots, icsFor, download };
})();
