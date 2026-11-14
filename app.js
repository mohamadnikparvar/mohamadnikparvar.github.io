/* Portfolio OS: window manager, dock, spotlight, apps.
   Content comes from content.js. You should not need to edit this file to add projects. */
(() => {
  "use strict";
  const P = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const badge = o => (o && o.sample ? '<span class="sample">Sample</span>' : "");
  const isPhone = () => matchMedia("(max-width:760px)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} }
  };

  /* ---------------- icons ---------------- */
  const GLYPH = {
    about: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.2-3.6 4-5.3 7-5.3s5.8 1.7 7 5.3"/>',
    experience: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5v-2A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M3.5 13h17"/>',
    work: '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path d="M3.5 10h17"/>',
    process: '<rect x="3" y="4" width="6.5" height="5" rx="1.2"/><rect x="14.5" y="15" width="6.5" height="5" rx="1.2"/><path d="M9.5 6.5h3.5a2 2 0 0 1 2 2V15"/><circle cx="6.2" cy="17.5" r="2.4"/><path d="M8.6 17.5h5.9"/>',
    skills: '<path d="M5 19V10M10 19V5M15 19v-7M20 19v-4M3 19h18"/>',
    education: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c1.5 1.6 3.5 2.4 5.5 2.4s4-.8 5.5-2.4V11M21.5 9v5"/>',
    terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7 10 3 2.5L7 15M12.5 15.5H17"/>',
    contact: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
    spec: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.2"/>',
    methodology: '<path d="M3.5 19h4.5v-4.5h4v-4.5h4V5.5h4.5"/><circle cx="3.5" cy="19" r="1.2"/><path d="m17.5 3.5 2.5 2-2.5 2"/>',
    services: '<path d="M12 3.5 3 8l9 4.5L21 8z"/><path d="m3 12.2 9 4.5 9-4.5M3 16.3l9 4.5 9-4.5"/>',
    research: '<path d="M9.5 3.5h5M10.5 3.5v5.2L5 18.2A1.6 1.6 0 0 0 6.4 20.5h11.2a1.6 1.6 0 0 0 1.4-2.3l-5.5-9.5V3.5"/><path d="M7.4 14.5h9.2"/>'
  };
  const UI = {
    search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
    x: '<svg viewBox="0 0 10 10"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5"/></svg>',
    min: '<svg viewBox="0 0 10 10"><path d="M2 5h6"/></svg>',
    max: '<svg viewBox="0 0 10 10"><path d="M3 7V3h4M7 3 3 7"/></svg>'
  };

  /* ---------------- apps ---------------- */
  const APPS = {
    about:      { title: "About Me",     g: ["#35c2b8", "#1d6f9c"], w: 600, h: 580, phone: true },
    experience: { title: "Experience",   g: ["#f6b445", "#d4572e"], w: 620, h: 600 },
    work:       { title: "Case Studies", g: ["#62afff", "#2a4fc4"], w: 860, h: 620, flush: true, phone: true },
    process:    { title: "Process Lab",  g: ["#43d1a6", "#0b6a8a"], w: 900, h: 640, phone: true },
    methodology:{ title: "Odoo Methodology", g: ["#b58cf5", "#6a3fb8"], w: 940, h: 640 },
    services:   { title: "Work With Me", g: ["#f58bc4", "#a8407f"], w: 920, h: 680 },
    research:   { title: "Research", g: ["#7fd0f0", "#2a6fb8"], w: 900, h: 680 },
    skills:     { title: "Skills",       g: ["#b688f5", "#5a3ec2"], w: 560, h: 500 },
    education:  { title: "Education",    g: ["#5279ea", "#1b2f80"], w: 540, h: 540 },
    terminal:   { title: "Terminal",     g: ["#4a5262", "#0e1218"], w: 660, h: 430, flush: true, sep: true },
    contact:    { title: "Contact",      g: ["#ff8a6b", "#d4495a"], w: 480, h: 460, phone: true },
    spec:       { title: "About This Portfolio", g: ["#9aa2b2", "#4a5262"], w: 440, h: 520, hidden: true }
  };
  const icon = id => `<span class="app-icon" style="background:linear-gradient(150deg,${APPS[id].g[0]},${APPS[id].g[1]})"><svg viewBox="0 0 24 24">${GLYPH[id]}</svg></span>`;
  // Photo (or initials) inside a slowly rotating glass ring. Tilts toward the pointer.
  const avatar = () => `<span class="avatar-ring">${P.profile.photo
    ? `<span class="avatar lens-av" title="Hover to see the real photo"><canvas class="sk" width="320" height="320" aria-hidden="true"></canvas><img class="real" src="${esc(P.profile.photo)}" alt="${esc(P.profile.name)}"></span>`
    : `<span class="avatar" aria-hidden="true">${esc(P.profile.initials)}</span>`}</span>`;
  // pencil sketch that draws itself; a lens reveals the real photo (same as the main site)
  const sketchify = root => {
    $$(".lens-av", root).forEach(av => {
      const cv = $(".sk", av), real = $(".real", av);
      const load = P.profile.sketch
        ? new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = P.profile.sketch; })
        : (window.makeSketch ? makeSketch(P.profile.photo, 320) : Promise.reject());
      load.then(sk => { try { drawIn(cv, sk, 1800); } catch { real.classList.add("show"); } }).catch(() => real.classList.add("show"));
      av.addEventListener("pointermove", e => { const b = av.getBoundingClientRect(); real.style.clipPath = `circle(${b.width * .32}px at ${e.clientX - b.left}px ${e.clientY - b.top}px)`; });
      av.addEventListener("pointerleave", e => { const b = av.getBoundingClientRect(); real.style.clipPath = `circle(0px at ${e.clientX - b.left}px ${e.clientY - b.top}px)`; });
      av.addEventListener("click", () => real.classList.toggle("show"));
    });
  };
  // buttons drift toward the pointer (same as the main site)
  const magnet = root => {
    if (reduced || !matchMedia("(pointer: fine)").matches) return;
    $$(".btn", root).forEach(b => {
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      b.addEventListener("pointerleave", () => b.style.transform = "");
    });
  };
  const tilt = root => {
    if (reduced) return;
    $$(".avatar-ring", root).forEach(r => {
      r.addEventListener("pointermove", e => {
        const b = r.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
        r.style.transform = `perspective(400px) rotateY(${x * 22}deg) rotateX(${-y * 22}deg) scale(1.05)`;
      });
      r.addEventListener("pointerleave", () => { r.style.transform = ""; });
    });
  };

  /* ---------------- shared pieces from the main site ---------------- */
  // drag-and-drop "put the phases in order" game
  function phaseGame(host, M) {
    const correct = M.phases.map((_, i) => i);
    const shuffle = () => { let a; do { a = [...correct].sort(() => Math.random() - .5); } while (a.every((v, i) => v === i)); return a; };
    const grip = '<svg viewBox="0 0 16 16"><circle cx="5" cy="3" r="1.4"/><circle cx="11" cy="3" r="1.4"/><circle cx="5" cy="8" r="1.4"/><circle cx="11" cy="8" r="1.4"/><circle cx="5" cy="13" r="1.4"/><circle cx="11" cy="13" r="1.4"/></svg>';
    const render = () => {
      host.innerHTML = `<div class="game-head"><p>Drag the phases into the order I use on real projects, then check.</p>
        <div class="btns"><button class="btn ghost" data-g="shuffle">Shuffle</button><button class="btn primary" data-g="check">Check my order</button></div></div>
        <ol class="sortable">${shuffle().map(i => `<li data-p="${i}"><span class="grip" aria-label="Drag ${esc(M.phases[i].name)}">${grip}</span><span class="num"></span><span class="nm">${esc(M.phases[i].name)}</span>
          <span class="mv"><button data-mv="-1" aria-label="Move up">↑</button><button data-mv="1" aria-label="Move down">↓</button></span></li>`).join("")}</ol>
        <p class="game-res" aria-live="polite"></p>`;
      renumber();
    };
    const list = () => $(".sortable", host);
    const renumber = () => $$("li", list()).forEach((li, k) => { $(".num", li).textContent = k + 1; li.classList.remove("ok", "bad"); });
    host.addEventListener("click", e => {
      const g = e.target.closest("[data-g]");
      if (g?.dataset.g === "shuffle") return render();
      if (g?.dataset.g === "check") {
        const lis = $$("li", list()); let ok = 0;
        lis.forEach((li, k) => { const good = +li.dataset.p === k; li.classList.toggle("ok", good); li.classList.toggle("bad", !good); if (good) ok++; });
        const res = $(".game-res", host);
        if (ok === lis.length) { res.textContent = "Perfect! You think like an implementer. 🎉"; confetti(); }
        else res.textContent = `${ok} of ${lis.length} in the right place. Hint: the review gate comes before any data is migrated.`;
        return;
      }
      const b = e.target.closest("[data-mv]"); if (!b) return;
      const li = b.closest("li"), L = list(), d = +b.dataset.mv;
      if (d < 0 && li.previousElementSibling) L.insertBefore(li, li.previousElementSibling);
      if (d > 0 && li.nextElementSibling) L.insertBefore(li.nextElementSibling, li);
      renumber(); b.focus();
    });
    host.addEventListener("pointerdown", e => {
      const g = e.target.closest(".grip"); if (!g || e.button !== 0) return;
      e.preventDefault();
      const L = list(), li = g.closest("li"), items = $$("li", L), from = items.indexOf(li);
      const rects = items.map(x => x.getBoundingClientRect()), h = rects[from].height, gap = 8, y0 = e.clientY;
      let to = from; li.classList.add("lift"); try { g.setPointerCapture(e.pointerId); } catch {}
      const move = ev => {
        const dy = ev.clientY - y0; li.style.transform = `translateY(${dy}px) scale(1.02)`;
        const c = rects[from].top + h / 2 + dy;
        to = items.filter((x, k) => k !== from && (rects[k].top + rects[k].height / 2) < c).length;
        items.forEach((x, k) => { if (k === from) return; let s = 0; if (from < to && k > from && k <= to) s = -(h + gap); if (to < from && k >= to && k < from) s = h + gap; x.style.transform = s ? `translateY(${s}px)` : ""; });
      };
      const up = () => {
        g.removeEventListener("pointermove", move); g.removeEventListener("pointerup", up); g.removeEventListener("pointercancel", up);
        items.forEach(x => { x.style.transition = "none"; x.style.transform = ""; }); li.classList.remove("lift");
        const rest = items.filter(x => x !== li); rest.splice(to, 0, li); rest.forEach(x => L.append(x)); renumber();
        requestAnimationFrame(() => items.forEach(x => x.style.transition = ""));
      };
      g.addEventListener("pointermove", move); g.addEventListener("pointerup", up); g.addEventListener("pointercancel", up);
    });
    render();
  }

  // project planner that writes a ready-to-send message
  function planner(host, S) {
    const p = P.profile;
    const MODS = ["Inventory", "Purchase", "Manufacturing", "Sales", "Accounting", "CRM", "HR", "POS", "Project"];
    const STARTS = ["As soon as possible", "Within 1–3 months", "Just exploring"];
    const st = { svc: 0, mods: new Set(["Inventory", "Purchase"]), users: 30, start: 1 };
    host.innerHTML = `<p class="label">Project planner</p><h4 class="pl-title">Sketch your Odoo project in 20 seconds.</h4>
      <div class="pl-group"><span>Service</span><div class="toggles" data-k="svc">${S.items.map((s, i) => `<button data-v="${i}" aria-pressed="${i === 0}">${esc(s.name)}</button>`).join("")}</div></div>
      <div class="pl-group"><span>Modules</span><div class="toggles" data-k="mods">${MODS.map(m => `<button data-v="${m}" aria-pressed="${st.mods.has(m)}">${m}</button>`).join("")}</div></div>
      <div class="pl-group"><span>Users: <b class="pl-users">${st.users}</b></span><input type="range" min="5" max="500" step="5" value="${st.users}" aria-label="Number of users"></div>
      <div class="pl-group"><span>Start</span><div class="toggles" data-k="start">${STARTS.map((s, i) => `<button data-v="${i}" aria-pressed="${i === st.start}">${s}</button>`).join("")}</div></div>
      <div class="pl-out"><pre></pre><div class="btns"><button class="btn primary" data-pl="copy">Copy message</button><a class="btn ghost" data-pl="mail" href="#">Open in email</a></div><small>Send it to ${esc(p.email)}</small></div>`;
    const draw = () => {
      const text = `Hi ${p.name.split(" ")[0]},\n\nWe're interested in: ${S.items[st.svc].name}\nModules: ${[...st.mods].join(", ") || "not sure yet"}\nUsers: about ${st.users}\nStart: ${STARTS[st.start].toLowerCase()}\n\nCompany:\nMy name:`;
      $("pre", host).textContent = text;
      $('[data-pl="mail"]', host).href = `mailto:${p.email}?subject=${encodeURIComponent("Odoo project: " + S.items[st.svc].name)}&body=${encodeURIComponent(text)}`;
    };
    host.addEventListener("click", e => {
      const b = e.target.closest(".toggles button");
      if (b) {
        const k = b.parentElement.dataset.k;
        if (k === "mods") { const v = b.dataset.v; st.mods.has(v) ? st.mods.delete(v) : st.mods.add(v); b.setAttribute("aria-pressed", st.mods.has(v)); }
        else { st[k] = +b.dataset.v; $$("button", b.parentElement).forEach(x => x.setAttribute("aria-pressed", x === b)); }
        return draw();
      }
      if (e.target.closest('[data-pl="copy"]')) {
        const t = $("pre", host).textContent;
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(t).then(() => toast("Copied", "Paste it into an email."), () => toast("Copy blocked", "Select the text and press Ctrl/Cmd + C."));
        else toast("Copy blocked", "Select the text and press Ctrl/Cmd + C.");
      }
    });
    $("input[type=range]", host).addEventListener("input", e => { st.users = +e.target.value; $(".pl-users", host).textContent = st.users; draw(); });
    draw();
  }

  function confetti() {
    if (reduced) return toast("🎉", "Correct!");
    let c = $("#confetti"); if (!c) { c = document.createElement("canvas"); c.id = "confetti"; document.body.append(c); }
    const ctx = c.getContext("2d"), d = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * d; c.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    const colors = ["#2f6bff", "#5b8cff", "#9db8ff", "#0e1116", "#c3c8d2"];
    const bits = Array.from({ length: 160 }, () => ({ x: innerWidth / 2, y: innerHeight * .55, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 6, r: Math.random() * 6 + 4, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: colors[Math.random() * colors.length | 0] }));
    const t0 = performance.now();
    const tick = now => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      bits.forEach(b => { b.vy += .45; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.a += b.va; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c; ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); ctx.restore(); });
      if (now - t0 < 3200) requestAnimationFrame(tick); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    requestAnimationFrame(tick);
  }

  /* ---------------- renderers ---------------- */
  const RENDER = {
    about(body) {
      const p = P.profile, edu = P.education[0];
      body.innerHTML = `
        <div class="about">
          <div class="about-top">${avatar()}<div><h3>${esc(p.name)}</h3><p>${esc(p.headline)}</p></div></div>
          <p class="tag">“${esc(p.tagline)}”</p>
          <div class="bio">${p.bio.map(t => `<p>${esc(t)}</p>`).join("")}</div>
          ${P.loves?.length ? `<div class="loves"><p class="label">What I love</p>${P.loves.map((l, i) => `<div class="love"><span class="ic">${i + 1}</span><div><b>${esc(l.title)}</b><small>${esc(l.text)}</small></div></div>`).join("")}</div>` : ""}
          <div class="facts">
            ${p.location ? `<div class="fact"><b>Based in</b><small>${esc(p.location)}</small></div>` : ""}
            ${edu ? `<div class="fact"><b>Education</b><small>${esc(edu.school)}</small></div>` : ""}
            ${P.languages?.length ? `<div class="fact"><b>Languages</b><small>${P.languages.map(esc).join(", ")}</small></div>` : ""}
          </div>
          <div class="btns">
            <button class="btn primary" data-open="work">See my case studies</button>
            <button class="btn ghost" data-open="process">Try the Process Lab</button>
            <button class="btn ghost" data-open="contact">Get in touch</button>
            ${p.cv ? `<a class="btn ghost" href="${esc(p.cv)}" target="_blank" rel="noopener">View CV</a>` : ""}
          </div>
        </div>`;
      tilt(body); sketchify(body);
    },

    research(body) {
      const R = P.research;
      if (!R) { body.innerHTML = "<p>Add research in content.js.</p>"; return; }
      const MIN = -0.4, MAX = 0.8, span = MAX - MIN, pos = v => ((v - MIN) / span) * 100;
      const ticks = [-0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8];
      const f2 = v => (v < 0 ? "−" : "") + Math.abs(v).toFixed(2);
      const bar = (v, cls, label) => `<span class="rb ${cls}" tabindex="0" data-tip="${esc(label)}: ${f2(v)}"
          style="left:${pos(Math.min(0, v))}%;width:${(Math.abs(v) / span) * 100}%"><i class="rv ${v < 0 ? "neg" : ""}">${f2(v)}</i></span>`;
      const S0 = 1, S1 = 5, sp = s => ((s - S0) / (S1 - S0)) * 100;
      body.innerHTML = `<div class="research">
        <div><p class="label">Master's thesis · ${esc(R.degree)} · ${esc(R.school)} · ${esc(R.year)}</p>
          <h3>${esc(R.title)}</h3><p class="r-formal">${esc(R.formalTitle)}</p></div>
        <p class="lede">${esc(R.summary)}</p>
        <div class="r-stats">${R.stats.map(s => `<div class="r-stat"><b>${esc(s.value)}</b><small>${esc(s.label)}</small></div>`).join("")}</div>
        <blockquote class="r-insight"><p class="label">Key finding</p><p>${esc(R.insight)}</p></blockquote>

        <section class="r-chart-wrap">
          <h4>What predicts a successful rollout</h4>
          <div class="r-legend"><span><i class="k1"></i>Effect on its own</span><span><i class="k2"></i>Effect with the other drivers</span></div>
          <div class="r-chart" role="img" aria-label="Standardized effects on ERP rollout success. ${R.drivers.map(d => `${d.name}: ${f2(d.alone)} on its own, ${f2(d.together)} with the other drivers`).join(". ")}">
            ${R.drivers.map(d => `<div class="r-row"><div class="r-name">${esc(d.name)}</div>
              <div class="r-track"><span class="zero" style="left:${pos(0)}%"></span>
                <div class="r-pair">${bar(d.alone, "b1", "On its own")}${bar(d.together, "b2", "With the other drivers")}</div>
              </div></div>`).join("")}
            <div class="r-row r-axis"><div></div><div class="r-track">${ticks.map(t => `<span style="left:${pos(t)}%">${f2(t)}</span>`).join("")}</div></div>
          </div>
          <p class="r-note">${esc(R.driversNote)}</p>
        </section>

        <section class="r-chart-wrap">
          <h4>How Shoniz scored today <small>(1 to 5, 3 is neutral)</small></h4>
          <div class="r-chart r-scores" role="img" aria-label="Average scores at Shoniz. ${R.current.map(c => `${c.name}: ${c.score}`).join(". ")}">
            ${R.current.map(c => `<div class="r-row"><div class="r-name">${esc(c.name)}${c.flag ? `<small class="r-flag">${esc(c.flag)}</small>` : ""}</div>
              <div class="r-track"><span class="zero mid" style="left:${sp(3)}%"></span>
                <div class="r-pair one"><span class="rb b1" tabindex="0" data-tip="${esc(c.name)}: ${c.score.toFixed(2)} of 5" style="left:0;width:${sp(c.score)}%"><i class="rv">${c.score.toFixed(2)}</i></span></div>
              </div></div>`).join("")}
            <div class="r-row r-axis"><div></div><div class="r-track">${[1, 2, 3, 4, 5].map(t => `<span style="left:${sp(t)}%">${t}</span>`).join("")}</div></div>
          </div>
        </section>

        <section><h4 style="margin-bottom:10px">What I recommended, in priority order</h4>
          <div class="r-recs">${R.recommendations.map((r, i) => `<article class="r-rec"><span class="svc-n">${i + 1}</span><h5>${esc(r.title)}</h5><ul class="checks">${r.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul></article>`).join("")}</div>
        </section>

        <section><p class="label" style="margin-bottom:8px">Methods and tools</p><div class="chips">${R.methods.map(m => `<span class="chip">${esc(m)}</span>`).join("")}</div></section>
        ${R.slides ? `<div class="btns"><a class="btn primary" href="${esc(R.slides)}" target="_blank" rel="noopener">View the defense slides (Persian, PDF) ↗</a></div>` : ""}
        <div class="r-tip" role="tooltip" hidden></div>
      </div>`;
      const tip = $(".r-tip", body), host = $(".research", body);
      const showTip = el => {
        const a = el.getBoundingClientRect(), h = host.getBoundingClientRect();
        tip.textContent = el.dataset.tip; tip.hidden = false;
        tip.style.left = Math.min(a.left - h.left + a.width / 2, h.width - 90) + "px";
        tip.style.top = (a.top - h.top - 8) + "px";
      };
      $$(".rb", body).forEach(el => {
        el.addEventListener("pointerenter", () => showTip(el));
        el.addEventListener("focus", () => showTip(el));
        el.addEventListener("pointerleave", () => { tip.hidden = true; });
        el.addEventListener("blur", () => { tip.hidden = true; });
      });
    },

    experience(body) {
      body.innerHTML = `<p class="label" style="margin-top:6px">Career</p>
        <ol class="timeline">${P.experience.map((j, i) => `
          <li class="job${i === 0 ? " open" : ""}" tabindex="0" role="button" aria-expanded="${i === 0}">
            <div class="job-head"><div><h4>${esc(j.role)}${badge(j)}</h4><div class="co">${esc(j.company)}</div></div><span class="when">${esc(j.period)}</span></div>
            <p class="sum">${esc(j.summary)}</p>
            <div class="more"><div>
              <ul>${(j.points || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
              <div class="chips">${(j.tags || []).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
            </div></div>
            <div class="toggle">${i === 0 ? "Show less" : "Show more"}</div>
          </li>`).join("")}</ol>`;
      const toggle = li => {
        const open = li.classList.toggle("open");
        li.setAttribute("aria-expanded", open);
        $(".toggle", li).textContent = open ? "Show less" : "Show more";
      };
      $$(".job", body).forEach(li => {
        li.addEventListener("click", () => toggle(li));
        li.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(li); } });
      });
      // timeline dots light up as you scroll the window (like the main site)
      const lit = () => { const r = body.getBoundingClientRect(), mid = r.top + r.height * .6; $$(".job", body).forEach(j => j.classList.toggle("lit", j.getBoundingClientRect().top < mid)); };
      body.addEventListener("scroll", lit, { passive: true }); requestAnimationFrame(lit);
    },

    work(body) {
      const cats = [...new Set(P.caseStudies.map(c => c.area.split("·")[0].trim()))];
      let filter = "All";
      body.innerHTML = `<div class="finder"><div class="f-side"></div><div class="f-main"></div></div>`;
      const side = $(".f-side", body), main = $(".f-main", body);
      const drawSide = () => {
        const count = c => c === "All" ? P.caseStudies.length : P.caseStudies.filter(x => x.area.startsWith(c)).length;
        side.innerHTML = `<p class="label">Projects</p>` + ["All", ...cats].map(c =>
          `<button class="${c === filter ? "on" : ""}" data-f="${esc(c)}">${c === "All" ? "All projects" : esc(c)}<span>${count(c)}</span></button>`).join("");
      };
      const grid = () => {
        const list = P.caseStudies.filter(c => filter === "All" || c.area.startsWith(filter));
        main.innerHTML = `<div class="f-grid">${list.map(c => `
          <button class="case" data-case="${esc(c.id)}">
            <span class="doc">${esc(c.year)}</span>
            <div><h4>${esc(c.title)}${badge(c)}</h4><div class="area">${esc(c.area)} · ${esc(c.system)}</div></div>
            ${c.results?.[0] ? `<div class="res">${esc(c.results[0].value)} ${esc(c.results[0].label)}</div>` : ""}
          </button>`).join("")}</div>`;
      };
      const detail = id => {
        const c = P.caseStudies.find(x => x.id === id);
        if (!c) return grid();
        main.innerHTML = `<article class="detail">
          <button class="back" data-back>← All projects</button>
          <div><h3>${esc(c.title)}</h3><p class="meta">${esc(c.area)} · ${esc(c.system)} · ${esc(c.year)} ${badge(c)}</p></div>
          <div class="results">${(c.results || []).map(r => `<div class="result"><b>${esc(r.value)}</b><small>${esc(r.label)}</small></div>`).join("")}</div>
          <section><p class="label">The problem</p><p style="margin-top:6px;max-width:62ch">${esc(c.problem)}</p></section>
          <section><p class="label" style="margin-bottom:10px">What I did</p><ol class="steps">${(c.approach || []).map(a => `<li><span>${esc(a)}</span></li>`).join("")}</ol></section>
          ${c.mindmap ? `<section><p class="label" style="margin-bottom:10px">Scope mind map</p><div class="mm-host"></div>
            ${c.mindmap.image ? `<button class="btn ghost" style="margin-top:12px" data-lightbox="${esc(c.mindmap.image)}" data-cap="Original mind map" data-tall>View the original mind map</button>` : ""}</section>` : ""}
          ${c.gallery?.length ? `<section><p class="label" style="margin-bottom:10px">Prototype</p>
            <div class="gallery">${c.gallery.map(g => `<button class="shot" data-lightbox="${esc(g.src)}" data-cap="${esc(g.caption)}"><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><span>${esc(g.caption)}</span></button>`).join("")}</div></section>` : ""}
          ${c.prototype ? `<a class="btn primary proto-link" href="${esc(c.prototype.href)}" target="_blank" rel="noopener" hidden>${esc(c.prototype.label)} ↗</a>` : ""}
          <div class="chips">${(c.tags || []).map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>
        </article>`;
        main.scrollTop = 0;
        if (c.mindmap && window.renderMindmap) renderMindmap($(".mm-host", main), c.mindmap);
        // only show the prototype link when the file is actually there
        const pl = $(".proto-link", main);
        if (pl) fetch(pl.getAttribute("href"), { method: "HEAD" }).then(r => { if (r.ok) pl.hidden = false; }).catch(() => {});
      };
      side.addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (!b) return; filter = b.dataset.f; drawSide(); grid(); });
      main.addEventListener("click", e => {
        const c = e.target.closest("[data-case]"); if (c) return detail(c.dataset.case);
        if (e.target.closest("[data-back]")) grid();
      });
      drawSide(); grid();
      return { openCase: detail };
    },

    process(body) {
      let proc = P.processes[0], mode = "asIs", running = false;
      body.innerHTML = `<div class="lab">
        <p style="color:var(--ink-2);max-width:66ch;margin-top:6px">Pick a process, switch between <b>As-is</b> and <b>To-be</b>, then run it. Dashed red steps are manual pain points. This is how I show teams where the time goes.</p>
        <div class="lab-bar">
          <div class="btns">
            ${P.processes.length > 1 ? `<select aria-label="Process" id="labProc">${P.processes.map(p => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("")}</select>` : ""}
            <div class="seg" role="tablist"><button class="on" data-m="asIs" role="tab">As-is</button><button data-m="toBe" role="tab">To-be</button></div>
          </div>
          <button class="btn primary" id="labRun">▶ Run process</button>
        </div>
        <div class="map"></div>
        <div class="legend"><span><i></i>Step</span><span><i class="m"></i>Manual pain point</span><span id="labNote"></span></div>
        <div class="metrics"></div>
      </div>`;
      const mapEl = $(".map", body), metEl = $(".metrics", body);
      const LH = 64, PADL = 112, COL = 150, NW = 126, NH = 34;
      let geo = null;

      const draw = () => {
        const flow = proc[mode], steps = flow.steps, lanes = proc.lanes;
        const nx = i => PADL + 54 + i * COL, ny = l => l * LH + (LH - NH) / 2, mid = l => l * LH + LH / 2;
        const W = nx(steps.length - 1) + NW + 70, H = lanes.length * LH;
        const sx = PADL + 22, sy = mid(steps[0].lane), ex = nx(steps.length - 1) + NW + 40, ey = mid(steps[steps.length - 1].lane);
        const edges = [], route = [`M${sx + 9} ${sy}`];
        edges.push(`M${sx + 9} ${sy} H${nx(0)}`);
        route.push(`H${nx(0)}`);
        steps.forEach((s, i) => {
          const x1 = nx(i) + NW, y1 = mid(s.lane);
          route.push(`H${x1}`);
          if (i < steps.length - 1) {
            const n = steps[i + 1], x2 = nx(i + 1), y2 = mid(n.lane), m = x1 + (COL - NW) / 2;
            const d = y1 === y2 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} H${m} V${y2} H${x2}`;
            edges.push(d);
            route.push(y1 === y2 ? `H${x2}` : `H${m} V${y2} H${x2}`);
          } else {
            edges.push(`M${x1} ${y1} H${ex - 11}`);
            route.push(`H${ex - 11}`);
          }
        });
        mapEl.innerHTML = `<svg style="width:100%;height:auto;min-width:${Math.round(W * .72)}px" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(proc.name)} ${mode === "asIs" ? "as-is" : "to-be"} process with ${steps.length} steps">
          <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" style="fill:var(--muted)"/></marker></defs>
          ${lanes.map((l, i) => `<text class="lane-l" x="14" y="${mid(i) + 4}">${esc(l)}</text>${i ? `<line class="lane-line" x1="0" x2="${W}" y1="${i * LH}" y2="${i * LH}"/>` : ""}`).join("")}
          <line class="lane-line" x1="${PADL}" x2="${PADL}" y1="0" y2="${H}"/>
          ${edges.map((d, i) => `<path class="edge" d="${d}" marker-end="url(#ah)" style="animation-delay:${i * 70}ms"/>`).join("")}
          <circle class="ev" cx="${sx}" cy="${sy}" r="9"/><circle class="ev end" cx="${ex}" cy="${ey}" r="10"/>
          ${steps.map((s, i) => `<g class="node grow${s.manual ? " manual" : ""}" style="animation-delay:${i * 80}ms" data-x="${nx(i)}">
            <rect x="${nx(i)}" y="${ny(s.lane)}" width="${NW}" height="${NH}" rx="9"/>
            <text x="${nx(i) + NW / 2}" y="${ny(s.lane) + NH / 2 + 4}" text-anchor="middle">${esc(s.label)}</text></g>`).join("")}
          <path id="route" d="${route.join(" ")}" fill="none" stroke="none"/>
          <circle class="token" r="7" cx="${sx}" cy="${sy}" opacity="0"/>
        </svg>`;
        geo = { steps };
        const before = proc.asIs.metrics, now = flow.metrics;
        metEl.innerHTML = Object.keys(now).map(k => `<div class="metric"><small>${esc(k)}</small><b>${esc(now[k])}</b>${mode === "toBe" && before[k] && before[k] !== now[k] ? `<span class="was">${esc(before[k])}</span>` : ""}</div>`).join("");
        const manual = steps.filter(s => s.manual).length;
        $("#labNote", body).textContent = `${steps.length} steps · ${manual} manual`;
        $(".sample-note", body)?.remove();
        if (proc.sample) metEl.insertAdjacentHTML("afterend", `<p class="sample-note" style="font-size:12px;color:var(--muted)">${badge(proc)} Example figures. Replace them in content.js with a process you improved.</p>`);
      };

      const run = () => {
        if (running) return;
        const svg = $("svg", mapEl), path = $("#route", svg), tok = $(".token", svg);
        const nodes = $$(".node", svg); nodes.forEach(n => n.classList.remove("hit"));
        const L = path.getTotalLength(), dur = reduced ? 1 : geo.steps.length * 650 + 400;
        running = true; tok.setAttribute("opacity", "1");
        const btn = $("#labRun", body); btn.disabled = true; btn.textContent = "Running…";
        const t0 = performance.now();
        const tick = now => {
          const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          const pt = path.getPointAtLength(e * L);
          tok.setAttribute("cx", pt.x); tok.setAttribute("cy", pt.y);
          nodes.forEach(n => { if (pt.x >= +n.dataset.x + 4) n.classList.add("hit"); });
          if (k < 1 && document.body.contains(svg)) requestAnimationFrame(tick);
          else {
            running = false; btn.disabled = false; btn.textContent = "▶ Run again";
            if (document.body.contains(svg)) {
              const m = proc[mode].metrics, ct = m["Cycle time"];
              toast(mode === "asIs" ? "As-is finished" : "To-be finished", ct ? `Cycle time: ${ct}. ${mode === "asIs" ? "Switch to To-be to compare." : "That's the improvement."}` : "Done.");
            }
          }
        };
        requestAnimationFrame(tick);
      };

      body.addEventListener("click", e => {
        const m = e.target.closest("[data-m]");
        if (m && !running) {
          mode = m.dataset.m;
          $$("[data-m]", body).forEach(b => b.classList.toggle("on", b === m));
          $("#labRun", body).textContent = "▶ Run process";
          draw();
        }
        if (e.target.closest("#labRun")) run();
      });
      $("#labProc", body)?.addEventListener("change", e => {
        if (running) { e.target.value = proc.id; return; }
        proc = P.processes.find(p => p.id === e.target.value); draw();
      });
      draw();
    },

    methodology(body) {
      const M = P.methodology;
      if (!M) { body.innerHTML = "<p>Add a methodology in content.js.</p>"; return; }
      const n = M.phases.length, gate = M.phases.findIndex(p => p.decision);
      const num = i => M.phases.slice(0, i + 1).filter(p => !p.decision).length;
      const total = M.phases.filter(p => !p.decision).length;
      let cur = 0, timer = null;
      body.innerHTML = `<div class="seg m-tabs" role="tablist" style="margin-top:6px"><button class="on" data-mt="explore" role="tab">Explore the phases</button><button data-mt="game" role="tab">🧩 Play: put them in order</button></div>
        <div class="m-game" hidden></div>
        <div class="method m-explore">
        <p class="lede">${esc(M.intro)}</p>
        <div class="btns">
          <button class="btn primary" id="mPlay">▶ Walk through a project</button>
          ${M.image ? `<button class="btn ghost" data-lightbox="${esc(M.image)}" data-cap="Odoo Implementation Methodology">View the original diagram</button>` : ""}
        </div>
        <ol class="flow">${M.phases.map((p, i) => `<li><button class="phase${p.decision ? " gate" : ""}" data-i="${i}">
          <span class="pn">${p.decision ? "?" : num(i)}</span><span class="pt">${esc(p.name)}</span>
          ${p.decision ? `<span class="loop">↺ back to ${esc(M.phases[p.loopTo]?.name || "")} if changes are needed</span>` : ""}
        </button></li>`).join("")}</ol>
        <div class="phase-card" aria-live="polite"></div>
      </div>`;
      const card = $(".phase-card", body), btn = $("#mPlay", body);
      const show = (i, visited) => {
        cur = i;
        $$(".phase", body).forEach((b, k) => {
          b.classList.toggle("on", k === i);
          b.setAttribute("aria-current", k === i ? "step" : "false");
          if (visited) b.classList.toggle("done", visited.has(k) && k !== i);
          else b.classList.remove("done");
        });
        const p = M.phases[i];
        card.innerHTML = `<div class="pc-in">
          <p class="label">${p.decision ? "Review gate" : `Phase ${num(i)} of ${total}`}</p>
          <h3>${esc(p.name)}</h3>
          <ul class="checks">${p.tasks.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
          ${p.decision ? `<div class="outcomes">
            <button class="chip ok" data-i="${i + 1}">Approved → ${esc(M.phases[i + 1]?.name || "")}</button>
            <button class="chip warn" data-i="${p.loopTo}">Changes required → ${esc(M.phases[p.loopTo]?.name || "")}</button></div>` : ""}
        </div>`;
        $(".phase.on", body)?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
      };
      const stop = () => { clearTimeout(timer); timer = null; btn.textContent = "▶ Walk through a project"; };
      const play = () => {
        const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
        const seq = gate >= 0 ? [...range(0, gate), ...range(M.phases[gate].loopTo, gate), ...range(gate + 1, n - 1)] : range(0, n - 1);
        const seen = new Set(); let k = 0;
        btn.textContent = "■ Stop";
        const step = () => {
          if (!body.isConnected) return stop();
          const i = seq[k], prev = seq[k - 1];
          if (prev === gate && i === M.phases[gate].loopTo) toast("Changes required", `Back to ${M.phases[i].name}, then review again.`, 2600);
          seen.add(i); show(i, seen);
          if (++k < seq.length) timer = setTimeout(step, reduced ? 600 : 1150);
          else { stop(); toast("Project live", "Hypercare, then a clean handover to your team."); }
        };
        step();
      };
      btn.addEventListener("click", () => (timer ? stop() : play()));
      body.addEventListener("click", e => {
        const t = e.target.closest("[data-mt]");
        if (t) {
          $$("[data-mt]", body).forEach(x => x.classList.toggle("on", x === t));
          const isGame = t.dataset.mt === "game", g = $(".m-game", body);
          $(".m-explore", body).hidden = isGame; g.hidden = !isGame;
          if (isGame) { stop(); if (!g.firstChild) phaseGame(g, M); }
          return;
        }
        const b = e.target.closest(".m-explore [data-i]"); if (!b) return;
        stop(); show(+b.dataset.i);
      });
      show(0);
    },

    services(body) {
      const S = P.services;
      if (!S) { body.innerHTML = "<p>Add services in content.js.</p>"; return; }
      body.innerHTML = `<div class="svc">
        <p class="lede">${esc(S.intro)}</p>
        <div class="svc-grid">${S.items.map((s, i) => `<article class="svc-card" style="animation-delay:${i * 90}ms">
          <span class="svc-n">${i + 1}</span>
          <h4>${esc(s.name)}</h4>
          <p class="svc-tag">${esc(s.tagline)}</p>
          <p class="svc-text">${esc(s.text)}</p>
          <ul class="checks">${s.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
          <span class="price">${esc(s.pricing)}</span>
        </article>`).join("")}</div>
        <div class="btns">
          <button class="btn primary" data-open="contact">Discuss a project</button>
          ${P.methodology ? `<button class="btn ghost" data-open="methodology">See my methodology</button>` : ""}
          ${S.image ? `<button class="btn ghost" data-lightbox="${esc(S.image)}" data-cap="Odoo services">View the original sheet</button>` : ""}
        </div>
        <div class="planner"></div>
      </div>`;
      planner($(".planner", body), S);
    },

    skills(body) {
      body.innerHTML = `<div class="skills" style="padding-top:6px">
        ${P.skills.map(g => `<div class="skill-group"><p class="label">${esc(g.group)}</p><div class="chips">${g.items.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>`).join("")}
        ${P.languages?.length ? `<div class="skill-group"><p class="label">Languages</p><div class="chips">${P.languages.map(s => `<span class="chip lang">${esc(s)}</span>`).join("")}</div></div>` : ""}
      </div>`;
    },

    education(body) {
      body.innerHTML = `<div class="edu" style="padding-top:6px">
        ${P.education.map(e => `<div class="edu-card">
          <h3>${esc(e.school)}</h3><p>${esc(e.place)}</p>
          <p class="deg">${esc(e.degree)}${e.field ? `, ${esc(e.field)}` : ""} ${badge(e)}</p>
          <p>${esc(e.period)}</p>
          ${e.note ? `<p style="margin-top:10px;font-size:13px">${esc(e.note)}</p>` : ""}
        </div>`).join("")}
        ${P.honors?.length ? `<p class="label">Honors</p>${P.honors.map(h => `<div class="cert honor"><span><b>🏅 ${esc(h.title)}</b><small style="display:block">${esc(h.detail)}</small></span><small>${esc(h.year)}</small></div>`).join("")}` : ""}
        ${P.certifications?.length ? `<p class="label">Certifications</p>${P.certifications.map(c => `<div class="cert"><b>${esc(c.name)}${badge(c)}</b><small>${esc(c.issuer)} · ${esc(c.year)}</small></div>`).join("")}` : ""}
      </div>`;
    },

    contact(body) {
      const p = P.profile;
      body.innerHTML = `<div class="contact" style="padding-top:6px">
        <h3>Let's talk.</h3>
        <p style="color:var(--ink-2)">${esc(p.available || "Happy to hear about product, BA and ERP roles.")}</p>
        <div class="c-row"><span class="k">Email</span><span class="v" id="cEmail">${esc(p.email)}</span><button class="btn ghost" id="cCopy">Copy</button></div>
        <div class="c-row"><span class="k">LinkedIn</span><a class="v" href="${esc(p.linkedin)}" target="_blank" rel="noopener">View profile ↗</a></div>
        ${p.github ? `<div class="c-row"><span class="k">GitHub</span><a class="v" href="${esc(p.github)}" target="_blank" rel="noopener">${esc(p.github.replace(/^https?:\/\//, ""))} ↗</a></div>` : ""}
        ${p.location ? `<div class="c-row"><span class="k">Location</span><span class="v">${esc(p.location)}</span></div>` : ""}
        ${p.cv ? `<div class="btns"><a class="btn primary" href="${esc(p.cv)}" target="_blank" rel="noopener">View my CV (PDF)</a></div>` : ""}
      </div>`;
      $("#cCopy", body).addEventListener("click", () => {
        const el = $("#cEmail", body);
        const fallback = () => { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("Email selected", "Press Ctrl/Cmd + C to copy it."); };
        if (navigator.clipboard?.writeText) navigator.clipboard.writeText(p.email).then(() => toast("Copied", p.email), fallback);
        else fallback();
      });
    },

    spec(body) {
      const p = P.profile;
      body.innerHTML = `<div class="spec">${avatar()}
        <div><h3>${esc(p.name)}</h3><p style="color:var(--muted);font-size:13px">Portfolio OS · Version 1.0</p></div>
        <dl>
          <dt>Role</dt><dd>${esc(p.headline)}</dd>
          <dt>Processor</dt><dd>Sharif-trained analytical engine</dd>
          <dt>Memory</dt><dd>${P.experience.length} roles · ${P.caseStudies.length} case studies</dd>
          <dt>Graphics</dt><dd>Liquid glass interface</dd>
          <dt>Startup disk</dt><dd>content.js</dd>
        </dl>
        <p style="color:var(--muted);font-size:12px;max-width:34ch">Every window reads from one content file, so new projects appear without touching the design.</p>
      </div>`;
      tilt(body); sketchify(body);
    },

    terminal(body) {
      body.innerHTML = `<div class="term" id="term"><div id="termOut"></div><div class="term-line"><span class="p">guest@portfolio ~ %</span><input id="termIn" aria-label="Terminal command" autocomplete="off" spellcheck="false"></div></div>`;
      const out = $("#termOut", body), input = $("#termIn", body), term = $("#term", body);
      const hist = []; let hi = 0;
      const print = html => { out.insertAdjacentHTML("beforeend", `<pre>${html}</pre>`); term.scrollTop = term.scrollHeight; };
      const CMDS = {
        help: () => `<span class="y">Commands</span>
  whoami        who I am
  experience    my roles
  projects      case studies
  skills        what I work with
  education     where I studied
  contact       how to reach me
  methodology   how I implement Odoo
  services      ways to work with me
  research      my ERP thesis in one line
  open &lt;app&gt;    open a window (about, work, process, skills…)
  theme &lt;mode&gt;  light, dark or auto
  clear         clear the screen`,
        whoami: () => `${esc(P.profile.name)}\n<span class="m">${esc(P.profile.headline)}</span>\n${esc(P.profile.tagline)}`,
        experience: () => P.experience.map(j => `<span class="p">${esc(j.period.padEnd(16))}</span> ${esc(j.role)} <span class="m">@ ${esc(j.company)}</span>`).join("\n"),
        projects: () => P.caseStudies.map(c => `<span class="y">●</span> ${esc(c.title)} <span class="m">(${esc(c.area)})</span>${c.results?.[0] ? ` → ${esc(c.results[0].value)} ${esc(c.results[0].label)}` : ""}`).join("\n") + `\n<span class="m">Type "open work" to read them.</span>`,
        skills: () => P.skills.map(g => `<span class="p">${esc(g.group)}:</span> ${g.items.map(esc).join(", ")}`).join("\n"),
        education: () => P.education.map(e => `${esc(e.degree)}${e.field ? ", " + esc(e.field) : ""}\n<span class="p">${esc(e.school)}</span> <span class="m">${esc(e.period)}</span>`).join("\n"),
        contact: () => `email     ${esc(P.profile.email)}\nlinkedin  ${esc(P.profile.linkedin)}`,
        methodology: () => (P.methodology?.phases || []).map((p, i) => `<span class="p">${String(i + 1).padStart(2, "0")}</span> ${esc(p.name)}${p.decision ? ` <span class="m">(review gate, loops back if changes are needed)</span>` : ""}`).join("\n") + `\n<span class="m">Type "open methodology" to walk through it.</span>`,
        services: () => (P.services?.items || []).map(s => `<span class="y">●</span> ${esc(s.name)} <span class="m">· ${esc(s.pricing)}</span>`).join("\n"),
        research: () => P.research ? `<span class="y">${esc(P.research.title)}</span>\n${esc(P.research.insight)}\n<span class="m">Type "open research" for the charts.</span>` : "No research yet.",
        date: () => new Date().toString(),
        clear: () => { out.innerHTML = ""; return null; },
        "sudo hire-me": () => { setTimeout(() => openApp("contact"), 500); return `<span class="y">Permission granted.</span> Opening contact…`; }
      };
      const exec = raw => {
        const cmd = raw.trim(); if (!cmd) return print(`<span class="p">guest@portfolio ~ %</span>`);
        hist.push(cmd); hi = hist.length;
        print(`<span class="p">guest@portfolio ~ %</span> ${esc(cmd)}`);
        const [a, b] = cmd.toLowerCase().split(/\s+/);
        if (a === "theme") {
          if (!["light", "dark", "auto"].includes(b)) return print(`usage: theme light | dark | auto <span class="m">(now: ${themeMode()})</span>`);
          setTheme(b); return print(`Appearance set to ${b}.`);
        }
        if (a === "open") {
          const id = Object.keys(APPS).find(k => k === b || APPS[k].title.toLowerCase().startsWith(b || "-"));
          return id ? (openApp(id), print(`Opening ${esc(APPS[id].title)}…`)) : print(`open: no app called "${esc(b || "")}"`);
        }
        const f = CMDS[cmd.toLowerCase()] || CMDS[a];
        if (!f) return print(`zsh: command not found: ${esc(a)}. Try <span class="y">help</span>.`);
        const r = f(); if (r != null) print(r);
      };
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") { exec(input.value); input.value = ""; }
        else if (e.key === "ArrowUp" && hi > 0) { input.value = hist[--hi]; e.preventDefault(); }
        else if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ""; }
      });
      term.addEventListener("click", () => input.focus());
      print(`<span class="m">Last login: ${new Date().toDateString()} on ttys001</span>\nWelcome. Type <span class="y">help</span> to see what you can ask.`);
      return { focus: () => input.focus() };
    }
  };

  /* ---------------- window manager ---------------- */
  const wins = new Map();
  let z = 10, cascade = 0;
  const desktop = $("#desktop"), winLayer = $("#windows");
  const dockItem = id => $(`.dock-item[data-app="${id}"]`);

  function openApp(id, after) {
    const app = APPS[id]; if (!app) return;
    closeMenus(); closeSpot();
    let w = wins.get(id);
    if (w) {
      if (w.el.hidden) restore(w);
      focusWin(w); after?.(w.api); return;
    }
    const el = document.createElement("section");
    el.className = "win" + (app.flush ? " flush" : "");
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", app.title);
    el.innerHTML = `<div class="win-title"><div class="lights">
        <button class="l-close" aria-label="Close ${esc(app.title)}">${UI.x}</button>
        <button class="l-min" aria-label="Minimise">${UI.min}</button>
        <button class="l-max" aria-label="Zoom">${UI.max}</button></div>
        <h2>${esc(app.title)}</h2></div><div class="win-body"></div>`;
    const D = desktop.getBoundingClientRect();
    const W = Math.min(app.w, D.width - 32), H = Math.min(app.h, D.height - 110);
    const leftMin = D.width > 1100 ? 350 : 16;
    const off = (cascade++ % 5) * 26;
    let x = Math.max(leftMin, (D.width - W) / 2 + (D.width > 1100 ? 150 : 0)) + off - 52;
    x = Math.min(Math.max(16, x), D.width - W - 16);
    const y = Math.max(14, Math.min((D.height - 96 - H) / 2 + off - 26, D.height - H - 96));
    Object.assign(el.style, { left: x + "px", top: y + "px", width: W + "px", height: H + "px" });
    const di = dockItem(id);
    if (di && !isPhone()) {
      const r = di.getBoundingClientRect();
      el.style.setProperty("--fx", `${r.left + r.width / 2 - (D.left + x + W / 2)}px`);
      el.style.setProperty("--fy", `${r.top + r.height / 2 - (D.top + y + H / 2)}px`);
    }
    winLayer.append(el);
    el.classList.add("opening");
    el.addEventListener("animationend", () => el.classList.remove("opening"), { once: true });
    w = { id, el, api: RENDER[id]($(".win-body", el)) || {} };
    magnet(el);
    wins.set(id, w);
    wire(w);
    if (di) { di.classList.add("running"); if (!reduced) { di.classList.remove("bounce"); void di.offsetWidth; di.classList.add("bounce"); } }
    focusWin(w);
    w.api.focus?.();
    after?.(w.api);
  }

  function focusWin(w) {
    w.el.style.zIndex = ++z;
    wins.forEach(o => o.el.classList.toggle("inactive", o !== w));
    $("#activeApp").textContent = APPS[w.id].title;
    try { if (location.hash !== "#" + w.id) history.replaceState(null, "", "#" + w.id); } catch {}
  }

  function topWin() {
    let best = null;
    wins.forEach(w => { if (!w.el.hidden && (!best || +w.el.style.zIndex > +best.el.style.zIndex)) best = w; });
    return best;
  }

  function afterLeave() {
    const t = topWin();
    if (t) focusWin(t);
    else { $("#activeApp").textContent = "Desktop"; try { history.replaceState(null, "", location.pathname + location.search); } catch {} }
  }

  function closeWin(w) {
    if (!w.el.isConnected || w.closing) return;
    w.closing = true;
    w.el.classList.remove("opening");
    w.el.classList.add("closing");
    const done = () => { w.el.remove(); wins.delete(w.id); dockItem(w.id)?.classList.remove("running"); afterLeave(); };
    w.el.addEventListener("animationend", done, { once: true });
    setTimeout(() => w.el.isConnected && done(), 400);
  }

  function minimize(w) {
    const di = dockItem(w.id); if (!di || isPhone()) return closeWin(w);
    const r = di.getBoundingClientRect(), e = w.el.getBoundingClientRect();
    w.el.classList.remove("maxed");
    w.el.style.transformOrigin = "center";
    w.el.classList.add("minimizing");
    w.el.style.transform = `translate(${r.left + r.width / 2 - (e.left + e.width / 2)}px,${r.top - (e.top + e.height / 2)}px) scale(.08)`;
    setTimeout(() => { w.el.hidden = true; w.el.classList.remove("minimizing"); w.el.style.transform = ""; afterLeave(); }, reduced ? 0 : 390);
  }

  function restore(w) {
    w.el.hidden = false;
    w.el.classList.add("opening");
    w.el.addEventListener("animationend", () => w.el.classList.remove("opening"), { once: true });
  }

  function wire(w) {
    const el = w.el, bar = $(".win-title", el);
    el.addEventListener("pointerdown", () => focusWin(w));
    $(".l-close", el).addEventListener("click", e => { e.stopPropagation(); closeWin(w); });
    $(".l-min", el).addEventListener("click", e => { e.stopPropagation(); minimize(w); });
    $(".l-max", el).addEventListener("click", e => { e.stopPropagation(); el.classList.toggle("maxed"); setTimeout(() => el.style.transition = "", 320); });
    bar.addEventListener("dblclick", e => { if (!e.target.closest("button") && !isPhone()) el.classList.toggle("maxed"); });
    bar.addEventListener("pointerdown", e => {
      if (e.target.closest("button") || isPhone() || el.classList.contains("maxed") || e.button !== 0) return;
      const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop, D = desktop.getBoundingClientRect();
      bar.setPointerCapture(e.pointerId);
      const move = ev => {
        const nx = Math.min(Math.max(ox + ev.clientX - sx, 80 - el.offsetWidth), D.width - 80);
        const ny = Math.min(Math.max(oy + ev.clientY - sy, 0), D.height - 60);
        el.style.left = nx + "px"; el.style.top = ny + "px";
      };
      const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); bar.removeEventListener("pointercancel", up); };
      bar.addEventListener("pointermove", move); bar.addEventListener("pointerup", up); bar.addEventListener("pointercancel", up);
    });
  }

  /* ---------------- dock, home grid, widgets ---------------- */
  function buildDock() {
    const inner = $("#dockInner");
    inner.innerHTML = Object.entries(APPS).filter(([, a]) => !a.hidden).map(([id, a]) =>
      `${a.sep ? '<span class="dock-sep"></span>' : ""}<button class="dock-item${a.phone ? "" : " extra"}" data-app="${id}" aria-label="${esc(a.title)}">${icon(id)}<span class="tip">${esc(a.title)}</span></button>`).join("");
    inner.addEventListener("click", e => { const b = e.target.closest(".dock-item"); if (b) openApp(b.dataset.app); });
    const items = () => $$(".dock-item", inner);
    inner.addEventListener("mousemove", e => {
      if (isPhone() || reduced) return;
      items().forEach(it => {
        const r = it.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2));
        it.style.setProperty("--s", (1 + 0.5 * Math.max(0, 1 - d / 140)).toFixed(3));
      });
    });
    inner.addEventListener("mouseleave", () => items().forEach(it => it.style.setProperty("--s", 1)));

    $("#homegrid").innerHTML = Object.entries(APPS).filter(([, a]) => !a.hidden).map(([id, a]) =>
      `<button class="home-app" data-open="${id}">${icon(id)}<span>${esc(a.title)}</span></button>`).join("");
  }

  function buildWidgets() {
    const p = P.profile, edu = P.education[0];
    const parts = p.name.split(" "), last = parts.pop();
    let ci = 0;
    const split = w => w.split(" ").map(word => `<span class="w">${[...word].map(ch => `<span class="ch" style="animation-delay:${(ci++) * 45 + 1500}ms">${esc(ch)}</span>`).join("")}</span>`).join(" ");
    const stats = P.impact?.length ? P.impact : (P.highlights || []);
    const roles = P.roles?.length ? P.roles : [p.headline];
    $("#widgets").innerHTML = `
      <div class="widget glass w-hello">
        <p class="eyebrow">I'm a <span class="w-rot"><span>${esc(roles[0])}</span></span></p>
        <h1 aria-label="${esc(p.name)}">${split(parts.join(" "))} <em>${split(last)}</em></h1>
        <p>${esc(p.tagline)}</p>
        ${p.available ? `<span class="status"><i></i>${esc(p.available)}</span>` : ""}
      </div>
      ${stats.length ? `<div class="widget glass"><p class="label" style="margin-bottom:10px">Impact</p>
        <div class="w-stats">${stats.map(h => `<div><b data-count="${+h.value}" data-prefix="${esc(h.prefix || "")}" data-suffix="${esc(h.suffix || "")}">${esc(h.prefix || "")}${esc(h.value)}${esc(h.suffix || "")}</b><small>${esc(h.label)}</small></div>`).join("")}</div></div>` : ""}
      ${P.clients?.length ? `<div class="widget glass w-clients"><p class="label">Clients &amp; companies</p><div class="w-marq"><div class="w-marq-track">${[...P.clients, ...P.clients].map((c, i) => `<span${i >= P.clients.length ? ' aria-hidden="true"' : ""}>${esc(c)}</span>`).join("")}</div></div></div>` : ""}
      ${edu ? `<button class="widget glass w-edu" data-open="education"><span class="crest">${esc(edu.school.charAt(0))}</span><span><b>${esc(edu.school)}</b><small>${esc(edu.degree)} · ${esc(edu.place)}</small></span></button>` : ""}
      <div class="widget glass w-hint"><span>Drag widgets around · search with</span><kbd>⌘ K</kbd></div>`;
    // rotating role, like the main site's hero
    const rot = $(".w-rot"); let ri = 0;
    if (rot && !reduced && roles.length > 1) setInterval(() => {
      const old = $("span:not(.out)", rot); old?.classList.add("out"); setTimeout(() => old?.remove(), 420);
      ri = (ri + 1) % roles.length; rot.insertAdjacentHTML("beforeend", `<span>${esc(roles[ri])}</span>`);
    }, 2600);
    // widgets can be dragged anywhere on the desktop (double-click puts one back)
    $$("#widgets .widget").forEach(w => {
      w.addEventListener("dblclick", () => { if (!w.classList.contains("floating")) return; w.classList.remove("floating"); w.removeAttribute("style"); $("#widgets").append(w); });
      w.addEventListener("pointerdown", e => {
        if (isPhone() || e.button !== 0 || e.target.closest("kbd")) return;
        const host = $("#desktop").getBoundingClientRect(), r = w.getBoundingClientRect(), ox = e.clientX - r.left, oy = e.clientY - r.top, sx = e.clientX, sy = e.clientY;
        let moved = false;
        const move = ev => {
          if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
          if (!moved) { moved = true; w.classList.add("floating", "dragging"); w.style.width = r.width + "px"; $("#desktop").append(w); try { w.setPointerCapture(e.pointerId); } catch {} }
          w.style.left = Math.min(Math.max(ev.clientX - host.left - ox, 0), host.width - r.width) + "px";
          w.style.top = Math.min(Math.max(ev.clientY - host.top - oy, 0), host.height - 60) + "px";
        };
        const up = ev => {
          removeEventListener("pointermove", move); removeEventListener("pointerup", up);
          w.classList.remove("dragging");
          if (moved) { const stop = c => { c.stopPropagation(); c.preventDefault(); }; w.addEventListener("click", stop, { capture: true }); setTimeout(() => w.removeEventListener("click", stop, { capture: true }), 60); }
        };
        addEventListener("pointermove", move); addEventListener("pointerup", up);
      });
    });
  }

  function countUp() {
    $$("[data-count]").forEach(b => {
      const end = +b.dataset.count, suf = b.dataset.suffix, pre = b.dataset.prefix || "", t0 = performance.now(), dur = 1400;
      if (reduced) return;
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
        b.textContent = pre + v + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------------- spotlight ---------------- */
  const spot = $("#spotlight"), spotIn = $("#spotInput"), spotRes = $("#spotResults");
  let results = [], sel = 0;
  const INDEX = [
    ...Object.entries(APPS).filter(([, a]) => !a.hidden).map(([id, a]) => ({ t: a.title, s: "Open app", app: id, k: a.title })),
    ...P.caseStudies.map(c => ({ t: c.title, s: `Case study · ${c.area}`, app: "work", go: api => api.openCase?.(c.id), k: [c.title, c.area, c.system, c.problem, ...(c.tags || [])].join(" ") })),
    ...P.experience.map(j => ({ t: j.role, s: `Experience · ${j.company}`, app: "experience", k: [j.role, j.company, j.summary, ...(j.tags || [])].join(" ") })),
    ...P.skills.flatMap(g => g.items.map(s => ({ t: s, s: `Skill · ${g.group}`, app: "skills", k: s + " " + g.group }))),
    ...P.education.map(e => ({ t: e.school, s: `Education · ${e.degree}`, app: "education", k: [e.school, e.degree, e.field].join(" ") })),
    ...P.processes.map(p => ({ t: p.name, s: "Process Lab", app: "process", k: p.name + " process bpmn" })),
    ...(P.methodology?.phases || []).map(p => ({ t: p.name, s: "Odoo methodology", app: "methodology", k: [p.name, ...p.tasks, "methodology odoo implementation"].join(" ") })),
    ...(P.research ? [{ t: P.research.title, s: "Research · Master's thesis", app: "research", k: [P.research.title, P.research.formalTitle, P.research.summary, P.research.insight, ...P.research.methods, "thesis research mba erp success"].join(" ") }] : []),
    ...(P.services?.items || []).map(s => ({ t: s.name, s: `Work with me · ${s.pricing}`, app: "services", k: [s.name, s.tagline, s.text, ...s.points, "services hire price"].join(" ") }))
  ];
  function renderSpot() {
    const q = spotIn.value.trim().toLowerCase();
    results = q ? INDEX.filter(r => r.k.toLowerCase().includes(q)).slice(0, 8) : INDEX.slice(0, 6);
    sel = 0;
    spotRes.innerHTML = results.length ? results.map((r, i) => `<li role="option" data-i="${i}" class="${i === sel ? "sel" : ""}" aria-selected="${i === sel}">${icon(r.app)}<div><b>${esc(r.t)}</b><small>${esc(r.s)}</small></div></li>`).join("")
      : `<li class="none">No results for “${esc(spotIn.value)}”</li>`;
  }
  function moveSel(d) {
    if (!results.length) return;
    sel = (sel + d + results.length) % results.length;
    $$("li[data-i]", spotRes).forEach((li, i) => { li.classList.toggle("sel", i === sel); li.setAttribute("aria-selected", i === sel); if (i === sel) li.scrollIntoView({ block: "nearest" }); });
  }
  function pick(i) { const r = results[i]; if (!r) return; closeSpot(); openApp(r.app, r.go); }
  function openSpot() { closeMenus(); spot.hidden = false; spotIn.value = ""; renderSpot(); setTimeout(() => spotIn.focus(), 10); }
  function closeSpot() { if (!spot.hidden) spot.hidden = true; }
  spotIn.addEventListener("input", renderSpot);
  spotIn.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); moveSel(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveSel(-1); }
    else if (e.key === "Enter") pick(sel);
    else if (e.key === "Escape") closeSpot();
  });
  spotRes.addEventListener("click", e => { const li = e.target.closest("li[data-i]"); if (li) pick(+li.dataset.i); });
  spot.addEventListener("pointerdown", e => { if (e.target === spot) closeSpot(); });

  /* ---------------- menu bar ---------------- */
  const logoBtn = $("#logoBtn"), logoMenu = $("#logoMenu");
  logoBtn.textContent = P.profile.initials;
  function closeMenus() { logoMenu.hidden = true; logoBtn.setAttribute("aria-expanded", "false"); }
  logoBtn.addEventListener("click", e => { e.stopPropagation(); const open = logoMenu.hidden; logoMenu.hidden = !open; logoBtn.setAttribute("aria-expanded", open); });
  document.addEventListener("click", e => {
    if (!e.target.closest("#logoMenu,#logoBtn")) closeMenus();
    const o = e.target.closest("[data-open]"); if (o) openApp(o.dataset.open);
    const L = e.target.closest("[data-lightbox]"); if (L) openLightbox(L.dataset.lightbox, L.dataset.cap, "tall" in L.dataset);
  });

  /* ---------------- lightbox ---------------- */
  const lb = $("#lightbox");
  function openLightbox(src, cap, tall) {
    const img = $("img", lb);
    img.src = src; img.alt = cap || "";
    $("figcaption", lb).textContent = cap || "";
    lb.classList.toggle("tall", !!tall); lb.scrollTop = 0;
    lb.hidden = false;
    $(".lb-close", lb).focus();
  }
  function closeLightbox() { if (lb.hidden) return; lb.hidden = true; $("img", lb).removeAttribute("src"); }
  lb.addEventListener("click", e => { if (!e.target.closest("img")) closeLightbox(); });
  $("#closeAll").addEventListener("click", () => { closeMenus(); [...wins.values()].forEach(closeWin); });
  $("#copyEmail").addEventListener("click", () => {
    closeMenus(); const em = P.profile.email;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(em).then(() => toast("Copied", em), () => toast("Email", em));
    else toast("Email", em);
  });
  // soft glow that follows the pointer (like the main site)
  if (matchMedia("(pointer: fine)").matches && !reduced) {
    const glow = $("#glow");
    addEventListener("pointermove", e => { document.body.classList.add("pointer"); glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
  }
  $("#searchBtn").innerHTML = UI.search;
  $("#searchBtn").addEventListener("click", openSpot);

  const isDark = () => { const t = document.documentElement.dataset.theme; return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
  const root = document.documentElement, themeBtn = $("#themeBtn");
  const themeMode = () => root.dataset.theme || "auto";
  function paintThemeBtn() {
    const d = isDark();
    themeBtn.classList.toggle("on", d);
    themeBtn.setAttribute("aria-checked", d);
    $$("[data-theme-set]").forEach(b => b.setAttribute("aria-checked", b.dataset.themeSet === themeMode()));
  }
  // mode: "light" | "dark" | "auto". x/y: where the circular reveal starts.
  function setTheme(mode, x = innerWidth - 60, y = 15) {
    const apply = () => {
      if (mode === "auto") delete root.dataset.theme; else root.dataset.theme = mode;
      store.set("pf-theme", mode);
      paintThemeBtn(); wallpaper.readColors();
    };
    if (!document.startViewTransition || reduced) return apply();
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" });
    }).catch(() => {});
  }
  const saved = store.get("pf-theme"); if (saved === "dark" || saved === "light") root.dataset.theme = saved;
  themeBtn.addEventListener("click", () => {
    const r = themeBtn.getBoundingClientRect();
    setTheme(isDark() ? "light" : "dark", r.left + r.width / 2, r.top + r.height / 2);
  });
  logoMenu.addEventListener("click", e => {
    const b = e.target.closest("[data-theme-set]"); if (!b) return;
    closeMenus(); setTheme(b.dataset.themeSet, 20, 15);
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { paintThemeBtn(); wallpaper.readColors(); });

  const clock = $("#clock");
  const tickClock = () => { clock.textContent = new Date().toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(",", ""); };
  tickClock(); setInterval(tickClock, 15000);

  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); spot.hidden ? openSpot() : closeSpot(); }
    else if (e.key === "Escape") { closeMenus(); closeSpot(); closeLightbox(); }
  });

  /* ---------------- toast ---------------- */
  let toastT;
  function toast(title, msg, ms = 4200) {
    const t = $("#toast");
    t.innerHTML = `<b>${esc(title)}</b>${esc(msg)}`;
    t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), ms);
  }

  /* ---------------- wallpaper ---------------- */
  const wallpaper = (() => {
    const c = $("#wallpaper"), ctx = c.getContext("2d");
    let cols = {}, W = 0, H = 0, tile = null, raf = 0;
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    function readColors() {
      cols = { a: css("--wall-a"), b: css("--wall-b"), c: css("--wall-c"), d: css("--wall-d"), base: css("--wall-base") };
      tile = makeTile(isDark() ? "rgba(255,255,255,.05)" : "rgba(20,40,80,.06)");
      if (W) frame(reduced ? 0 : performance.now());
    }
    function makeTile(stroke) {
      // eight-point star lattice, a nod to Persian tilework
      const s = 96, t = document.createElement("canvas"); t.width = t.height = s;
      const g = t.getContext("2d"); g.strokeStyle = stroke; g.lineWidth = 1;
      const star = (cx, cy, r) => {
        g.beginPath(); g.rect(cx - r, cy - r, 2 * r, 2 * r); g.stroke();
        g.save(); g.translate(cx, cy); g.rotate(Math.PI / 4); g.beginPath(); g.rect(-r, -r, 2 * r, 2 * r); g.stroke(); g.restore();
      };
      star(s / 2, s / 2, 20); [0, s].forEach(x => [0, s].forEach(y => star(x, y, 20)));
      return ctx.createPattern(t, "repeat");
    }
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) frame(0);
    }
    function blob(x, y, r, col) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const h = col.replace("#", ""), n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
      g.addColorStop(0, col); g.addColorStop(1, `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    function frame(t) {
      const k = t / 9000, m = Math.max(W, H);
      ctx.globalAlpha = 1; ctx.fillStyle = cols.base; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = .9;
      blob(W * (.18 + .08 * Math.sin(k)), H * (.25 + .1 * Math.cos(k * 1.3)), m * .55, cols.a);
      blob(W * (.82 + .07 * Math.cos(k * .8)), H * (.3 + .12 * Math.sin(k * 1.1)), m * .5, cols.b);
      blob(W * (.6 + .1 * Math.sin(k * .7 + 2)), H * (.95 + .06 * Math.cos(k)), m * .45, cols.c);
      blob(W * (.35 + .1 * Math.cos(k * .9 + 1)), H * (.7 + .08 * Math.sin(k * 1.4)), m * .35, cols.d);
      ctx.globalAlpha = 1;
      if (tile) { ctx.fillStyle = tile; ctx.fillRect(0, 0, W, H); }
    }
    let last = 0;
    function loop(t) {
      raf = requestAnimationFrame(loop);
      if (t - last < 33) return; last = t; frame(t);
    }
    addEventListener("resize", size);
    document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden && !reduced) raf = requestAnimationFrame(loop); });
    size(); readColors();
    if (!reduced) raf = requestAnimationFrame(loop); else frame(0);
    return { readColors };
  })();

  /* ---------------- boot ---------------- */
  buildDock(); buildWidgets(); paintThemeBtn();
  const boot = $("#boot");
  $(".boot-mark", boot).textContent = P.profile.initials;
  const start = () => {
    boot.classList.add("done");
    setTimeout(() => boot.remove(), 700);
    countUp();
    const h = location.hash.slice(1);
    if (APPS[h]) openApp(h);
    else if (!isPhone()) openApp("about");
    setTimeout(() => toast("Welcome", isPhone() ? "Tap an app to open it." : "Open apps from the dock, or press ⌘K / Ctrl+K to search."), 900);
  };
  const quick = reduced || store.sget("pf-booted");
  store.sset("pf-booted", "1");
  setTimeout(start, quick ? 50 : 1450);
  addEventListener("hashchange", () => { const h = location.hash.slice(1); if (APPS[h]) openApp(h); });
})();
