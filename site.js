/* Main scrolling site. All text comes from content.js; edit that file, not this one. */
(() => {
  "use strict";
  const P = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };
  const root = document.documentElement;

  /* ---------------- toast ---------------- */
  let toastT;
  function toast(msg, ms = 3200) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), ms);
  }

  /* ---------------- theme ---------------- */
  const isDark = () => { const t = root.dataset.theme; return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
  const saved = store.get("pf-theme"); if (saved === "dark" || saved === "light") root.dataset.theme = saved;
  const themeBtn = $("#themeBtn");
  const paintTheme = () => {
    themeBtn.classList.toggle("on", isDark()); themeBtn.setAttribute("aria-checked", isDark());
    const mode = root.dataset.theme || "auto";
    $$("[data-theme-set]").forEach(b => b.setAttribute("aria-checked", b.dataset.themeSet === mode));
  };
  function setTheme(mode, x = innerWidth - 80, y = 30) {
    const apply = () => {
      if (mode === "auto") delete root.dataset.theme; else root.dataset.theme = mode;
      store.set("pf-theme", mode); paintTheme(); bg.readColors();
    };
    if (!document.startViewTransition || reduced) return apply();
    document.startViewTransition(apply).ready.then(() => {
      const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" });
    }).catch(() => {});
  }
  themeBtn.addEventListener("click", () => { const b = themeBtn.getBoundingClientRect(); setTheme(isDark() ? "light" : "dark", b.left + b.width / 2, b.top + b.height / 2); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { paintTheme(); bg.readColors(); });

  /* ---------------- background ---------------- */
  const bg = (() => {
    const c = $("#bg"), ctx = c.getContext("2d");
    let W = 0, H = 0, cols = {}, tile = null, raf = 0, last = 0;
    const css = n => getComputedStyle(root).getPropertyValue(n).trim();
    const rgba0 = hex => { const h = hex.replace("#", ""), n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},0)`; };
    function makeTile(stroke) {
      const s = 110, t = document.createElement("canvas"); t.width = t.height = s;
      const g = t.getContext("2d"); g.strokeStyle = stroke; g.lineWidth = 1;
      const star = (cx, cy, r) => { g.beginPath(); g.rect(cx - r, cy - r, 2 * r, 2 * r); g.stroke(); g.save(); g.translate(cx, cy); g.rotate(Math.PI / 4); g.beginPath(); g.rect(-r, -r, 2 * r, 2 * r); g.stroke(); g.restore(); };
      star(s / 2, s / 2, 22); [0, s].forEach(x => [0, s].forEach(y => star(x, y, 22)));
      return ctx.createPattern(t, "repeat");
    }
    function blob(x, y, r, col) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, rgba0(col)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    function frame(t) {
      const k = t / 12000, m = Math.max(W, H);
      ctx.globalAlpha = 1; ctx.fillStyle = cols.base; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = .55;
      blob(W * (.15 + .08 * Math.sin(k)), H * (.18 + .1 * Math.cos(k * 1.2)), m * .5, cols.a);
      blob(W * (.88 + .06 * Math.cos(k * .8)), H * (.3 + .12 * Math.sin(k)), m * .45, cols.b);
      blob(W * (.55 + .1 * Math.sin(k * .7 + 2)), H * (1 + .05 * Math.cos(k)), m * .4, cols.c);
      ctx.globalAlpha = 1;
      if (tile) { ctx.fillStyle = tile; ctx.fillRect(0, 0, W, H); }
    }
    function size() { const d = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight; c.width = W * d; c.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); frame(performance.now()); }
    function readColors() { cols = { a: css("--wall-a"), b: css("--wall-b"), c: css("--wall-c"), base: css("--wall-base") }; tile = makeTile(isDark() ? "rgba(255,255,255,.035)" : "rgba(20,40,80,.045)"); if (W) frame(performance.now()); }
    function loop(t) { raf = requestAnimationFrame(loop); if (t - last < 42) return; last = t; frame(t); }
    addEventListener("resize", size);
    document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden && !reduced) raf = requestAnimationFrame(loop); });
    readColors(); size(); if (!reduced) raf = requestAnimationFrame(loop);
    return { readColors };
  })();
  paintTheme();

  /* boot screen, once per visit (like desktop mode) */
  (() => {
    let seen = false; try { seen = !!sessionStorage.getItem("pf-site-booted"); sessionStorage.setItem("pf-site-booted", "1"); } catch {}
    if (seen || reduced) return;
    const boot = $("#boot"); $(".boot-mark", boot).textContent = P.profile.initials; boot.hidden = false;
    setTimeout(() => { boot.classList.add("done"); setTimeout(() => boot.remove(), 650); }, 1250);
  })();

  /* pointer glow */
  if (finePointer && !reduced) {
    const glow = $("#glow");
    addEventListener("pointermove", e => { document.body.classList.add("pointer"); glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
    document.addEventListener("pointerleave", () => document.body.classList.remove("pointer"));
  }

  /* ---------------- nav: progress, scrolled, active pill, sheet ---------------- */
  const nav = $("#nav"), prog = $("#progress");
  const SECTION_NAMES = { top: "Home", about: "About", experience: "Experience", education: "Education", work: "Case studies", methodology: "Methodology", research: "Research", services: "Services", contact: "Contact" };
  const cur = $("#mbCurrent");
  const setCurrent = name => {
    const now = $("span:not(.out)", cur); if (now && now.textContent === name) return;
    now?.classList.add("out"); setTimeout(() => now?.remove(), 350);
    cur.insertAdjacentHTML("beforeend", `<span>${esc(name)}</span>`);
  };

  /* menu bar: MN menu, clock */
  const logoBtn = $("#logoBtn"), logoMenu = $("#logoMenu");
  logoBtn.textContent = P.profile.initials;
  const closeMenu = () => { logoMenu.hidden = true; logoBtn.setAttribute("aria-expanded", "false"); };
  const openMenu = () => { logoMenu.hidden = false; logoBtn.setAttribute("aria-expanded", "true"); paintTheme(); $("button", logoMenu)?.focus(); };
  logoBtn.addEventListener("click", e => { e.stopPropagation(); logoMenu.hidden ? openMenu() : closeMenu(); });
  document.addEventListener("click", e => { if (!e.target.closest("#logoMenu,#logoBtn")) closeMenu(); });
  logoMenu.addEventListener("keydown", e => {
    const items = $$("button", logoMenu), i = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if (e.key === "Escape") { closeMenu(); logoBtn.focus(); }
  });
  logoMenu.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    closeMenu();
    if (b.dataset.go) document.getElementById(b.dataset.go)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    else if (b.dataset.themeSet) { const r = logoBtn.getBoundingClientRect(); setTheme(b.dataset.themeSet, r.left + r.width / 2, r.top + r.height / 2); }
    else if (b.dataset.act === "copy") copy(P.profile.email, "Email copied");
    else if (b.dataset.act === "desktop") location.href = "desktop.html";
    else if (b.dataset.act === "spec") openSpec();
    else if (b.dataset.act === "terminal") openTerm();
    else if (b.dataset.act === "closeall") closeAll();
  });
  const clock = $("#clock");
  const tickClock = () => { clock.textContent = new Date().toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(",", ""); };
  tickClock(); setInterval(tickClock, 15000);

  /* ---------------- dock (bottom navigation, like desktop mode) ---------------- */
  const GLYPH = {
    about: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.2-3.6 4-5.3 7-5.3s5.8 1.7 7 5.3"/>',
    experience: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5v-2A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M3.5 13h17"/>',
    work: '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path d="M3.5 10h17"/>',
    methodology: '<path d="M3.5 19h4.5v-4.5h4v-4.5h4V5.5h4.5"/><circle cx="3.5" cy="19" r="1.2"/><path d="m17.5 3.5 2.5 2-2.5 2"/>',
    research: '<path d="M9.5 3.5h5M10.5 3.5v5.2L5 18.2A1.6 1.6 0 0 0 6.4 20.5h11.2a1.6 1.6 0 0 0 1.4-2.3l-5.5-9.5V3.5"/><path d="M7.4 14.5h9.2"/>',
    services: '<path d="M12 3.5 3 8l9 4.5L21 8z"/><path d="m3 12.2 9 4.5 9-4.5M3 16.3l9 4.5 9-4.5"/>',
    contact: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
    education: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c1.5 1.6 3.5 2.4 5.5 2.4s4-.8 5.5-2.4V11M21.5 9v5"/>',
    desktop: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>'
  };
  // phone: true = also shown on small screens (room for about five)
  const DOCK = [
    { id: "about", label: "About", phone: true }, { id: "experience", label: "Experience" }, { id: "education", label: "Education" }, { id: "work", label: "Case studies", phone: true },
    { id: "methodology", label: "Methodology", phone: true }, { id: "research", label: "Research", phone: true },
    { id: "services", label: "Services" }, { id: "contact", label: "Contact", phone: true }
  ].filter(d => document.getElementById(d.id) && !document.getElementById(d.id).hidden);
  const dock = $("#dock"), dockIn = $("#dockInner");
  dockIn.innerHTML = DOCK.map(d => `<a class="dock-item${d.phone ? "" : " extra"}" href="#${d.id}" data-sec="${d.id}" aria-label="${esc(d.label)}">
      <span class="dock-icon"><svg viewBox="0 0 24 24">${GLYPH[d.id]}</svg></span><span class="tip">${esc(d.label)}</span></a>`).join("") +
    `<span class="dock-sep" aria-hidden="true"></span><a class="dock-item desk" href="desktop.html" aria-label="Explore desktop mode">
      <span class="dock-icon"><svg viewBox="0 0 24 24">${GLYPH.desktop}</svg></span><span class="tip">Desktop mode ✦</span></a>`;
  const dockItems = $$(".dock-item", dockIn);
  // magnify toward the pointer
  if (finePointer && !reduced) {
    dockIn.addEventListener("mousemove", e => $$(".dock-item", dockIn).forEach(it => {
      const r = it.getBoundingClientRect(), dd = Math.abs(e.clientX - (r.left + r.width / 2));
      it.style.setProperty("--s", (1 + .45 * Math.max(0, 1 - dd / 130)).toFixed(3));
    }));
    dockIn.addEventListener("mouseleave", () => dockItems.forEach(it => it.style.setProperty("--s", 1)));
  }
  dockIn.addEventListener("click", e => {
    const it = e.target.closest(".dock-item"); if (!it || reduced) return;
    it.classList.remove("bounce"); void it.offsetWidth; it.classList.add("bounce");
  });
  const markDock = id => dockItems.forEach(it => { const on = it.dataset.sec === id; it.classList.toggle("on", on); if (on) it.setAttribute("aria-current", "true"); else it.removeAttribute("aria-current"); });

  // auto-hide while scrolling down, come back on scroll up or when scrolling stops
  let lastY = scrollY, idleT;
  const showDock = () => dock.classList.remove("away");
  const dockOnScroll = () => {
    const y = scrollY, down = y > lastY + 4, up = y < lastY - 4;
    if (down && y > 300 && !dock.contains(document.activeElement)) dock.classList.add("away");
    if (up) showDock();
    if (down || up) lastY = y;
    clearTimeout(idleT); idleT = setTimeout(showDock, 900);
  };
  dock.addEventListener("focusin", showDock);

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    nav.classList.toggle("scrolled", scrollY > 10);
    timelineFill(); dockOnScroll();
  };
  addEventListener("scroll", onScroll, { passive: true });
  const secIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      markDock(en.target.id);
      setCurrent(SECTION_NAMES[en.target.id] || "Home");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["top", "about", "experience", "education", "work", "methodology", "research", "services", "contact"].forEach(id => { const s = document.getElementById(id); if (s) secIO.observe(s); });

  /* ---------------- hero ---------------- */
  const p = P.profile;
  $("#heroStatus").textContent = p.available || "Product · ERP · Supply chain";
  if (!p.available) $(".status").hidden = true;
  const parts = p.name.split(" "), last = parts.pop();
  let ci = 0;
  const split = (word, tag) => `<span class="w">${[...word].map(ch => `<span class="ch" style="animation-delay:${(ci++) * 45}ms">${esc(ch)}</span>`).join("")}</span>`;
  $("#heroTitle").innerHTML = `${parts.map(w => split(w)).join(" ")} <em>${split(last)}</em>`;
  $("#heroTitle").setAttribute("aria-label", p.name);
  $("#heroTag").textContent = p.tagline;
  if (!p.cv) $("#heroCv").hidden = true; else $("#heroCv").href = p.cv;

  const roles = P.roles?.length ? P.roles : [p.headline];
  const rot = $("#rotator"); let ri = 0;
  rot.innerHTML = `<span>${esc(roles[0])}</span>`;
  if (!reduced && roles.length > 1) setInterval(() => {
    const old = $("span:not(.out)", rot); old?.classList.add("out"); setTimeout(() => old?.remove(), 420);
    ri = (ri + 1) % roles.length; rot.insertAdjacentHTML("beforeend", `<span>${esc(roles[ri])}</span>`);
  }, 2600);

  const ring = $("#photoRing");
  if (p.photo && window.makeSketch) {
    // pencil sketch that draws itself; a "lens" reveals the real photo underneath
    ring.innerHTML = `<div class="portrait"><canvas class="sketch" width="560" height="560" aria-hidden="true"></canvas>
      <img class="real" src="${esc(p.photo)}" alt="${esc(p.name)}"></div>`;
    $(".hero-visual").insertAdjacentHTML("beforeend", `<p class="lens-hint">${finePointer ? "Hover the sketch to see the real me" : "Tap the sketch to see the real me"}</p>`);
    const portrait = $(".portrait", ring), real = $(".real", ring), cv = $(".sketch", ring);
    // use the pre-made sketch file; only build one in the browser if no file is set
    const loadSketch = () => p.sketch
      ? new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = p.sketch; })
      : makeSketch(p.photo, 560);
    loadSketch()
      .then(sk => setTimeout(() => { try { drawIn(cv, sk, 2600); } catch { real.classList.add("show"); } }, reduced ? 0 : 500))
      .catch(() => real.classList.add("show"));   // if anything fails, show the real photo instead of a blank circle
    let shown = false;
    const lens = (x, y, r) => { real.style.clipPath = `circle(${r}px at ${x}px ${y}px)`; };
    if (finePointer) {
      portrait.addEventListener("pointermove", e => { const b = portrait.getBoundingClientRect(); lens(e.clientX - b.left, e.clientY - b.top, b.width * .3); });
      portrait.addEventListener("pointerleave", e => { const b = portrait.getBoundingClientRect(); lens(e.clientX - b.left, e.clientY - b.top, 0); });
    }
    portrait.addEventListener("click", () => { shown = !shown; real.classList.toggle("show", shown); if (!shown) real.style.clipPath = ""; });
  } else ring.innerHTML = `<span class="initials">${esc(p.initials)}</span>`;
  if (finePointer && !reduced) {
    ring.addEventListener("pointermove", e => { const b = ring.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; ring.style.transform = `perspective(600px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`; });
    ring.addEventListener("pointerleave", () => ring.style.transform = "");
  }

  // draggable stat cards around the photo
  const hv = $("#heroVisual");
  const spots = [{ l: "0%", t: "8%" }, { l: "62%", t: "18%" }, { l: "6%", t: "70%" }];
  (P.highlights || []).slice(0, 3).forEach((h, i) => {
    const el = document.createElement("div");
    el.className = "float-card"; el.tabIndex = 0; el.setAttribute("role", "img");
    el.setAttribute("aria-label", `${h.prefix || ""}${h.value}${h.suffix || ""} ${h.label}`);
    el.innerHTML = `<b>${esc(h.prefix || "")}${esc(h.value)}${esc(h.suffix || "")}</b><small>${esc(h.label)}</small>`;
    el.style.left = spots[i].l; el.style.top = spots[i].t;
    hv.append(el); dragCard(el);
  });
  // a fourth card for Sharif, like the education widget in desktop mode
  const edu0 = P.education?.[0];
  if (edu0) {
    const el = document.createElement("div");
    el.className = "float-card edu"; el.tabIndex = 0; el.setAttribute("role", "img"); el.setAttribute("aria-label", `${edu0.school}, ${edu0.degree}`);
    el.innerHTML = `<span class="crest" aria-hidden="true">${esc(edu0.school.charAt(0))}</span><span><b>${esc(edu0.school)}</b><small>${esc(edu0.degree)}${edu0.field ? ", " + esc(edu0.field) : ""}</small></span>`;
    el.style.left = "52%"; el.style.top = "80%";
    hv.append(el); dragCard(el);
  }
  function dragCard(el) {
    el.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      const box = hv.getBoundingClientRect(), r = el.getBoundingClientRect();
      const ox = e.clientX - r.left, oy = e.clientY - r.top;
      try { el.setPointerCapture(e.pointerId); } catch {} el.classList.add("dragging");
      $(".drag-hint", hv)?.remove();
      const move = ev => {
        const x = Math.min(Math.max(ev.clientX - box.left - ox, -20), box.width - r.width + 20);
        const y = Math.min(Math.max(ev.clientY - box.top - oy, -20), box.height - r.height + 20);
        el.style.left = x + "px"; el.style.top = y + "px";
      };
      const up = () => { el.classList.remove("dragging"); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); };
      el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    });
  }

  // magnetic buttons
  if (finePointer && !reduced) $$(".magnetic").forEach(b => {
    b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    b.addEventListener("pointerleave", () => b.style.transform = "");
  });

  /* ---------------- marquee ---------------- */
  const names = P.clients || [];
  $("#marquee").innerHTML = [...names, ...names].map((n, i) => `<span${i >= names.length ? ' aria-hidden="true"' : ""}>${esc(n)}</span>`).join("");
  if (!names.length) $(".marquee").hidden = true;

  /* ---------------- impact ---------------- */
  const impact = P.impact || P.highlights || [];
  $("#impact").innerHTML = impact.map(s => `<div class="stat reveal"><b data-count="${+s.value}" data-pre="${esc(s.prefix || "")}" data-suf="${esc(s.suffix || "")}">${esc(s.prefix || "")}${esc(s.value)}${esc(s.suffix || "")}</b><small>${esc(s.label)}</small></div>`).join("");
  const countIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; countIO.unobserve(en.target);
    const b = en.target, end = +b.dataset.count, t0 = performance.now();
    if (reduced) return;
    const step = now => { const k = Math.min(1, (now - t0) / 1500); b.textContent = b.dataset.pre + Math.round(end * (1 - Math.pow(1 - k, 4))) + b.dataset.suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$("[data-count]").forEach(b => countIO.observe(b));

  /* ---------------- about ---------------- */
  $("#aboutStory").innerHTML = p.bio.map(t => `<p>${esc(t)}</p>`).join("");
  $("#loves").innerHTML = (P.loves || []).map((l, i) => `<div class="love card reveal"><span class="ic">${i + 1}</span><div><h3>${esc(l.title)}</h3><p>${esc(l.text)}</p></div></div>`).join("");
  const groups = [...P.skills, ...(P.languages?.length ? [{ group: "Languages", items: P.languages }] : [])];
  const tabs = $("#skillTabs"), ind = $(".tab-ind", tabs), chips = $("#skillChips");
  tabs.insertAdjacentHTML("beforeend", groups.map((g, i) => `<button role="tab" data-g="${i}" aria-selected="${i === 0}" class="${i === 0 ? "on" : ""}">${esc(g.group)}</button>`).join(""));
  const showGroup = i => {
    $$("button", tabs).forEach(b => { const on = +b.dataset.g === i; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    const b = $(`button[data-g="${i}"]`, tabs);
    Object.assign(ind.style, { left: b.offsetLeft + "px", top: b.offsetTop + "px", width: b.offsetWidth + "px", height: b.offsetHeight + "px" });
    chips.innerHTML = groups[i].items.map((s, k) => `<span class="chip" style="animation-delay:${k * 40}ms">${esc(s)}</span>`).join("");
  };
  tabs.addEventListener("click", e => { const b = e.target.closest("button[data-g]"); if (b) showGroup(+b.dataset.g); });
  addEventListener("resize", () => showGroup(+($("button.on", tabs)?.dataset.g || 0)));
  requestAnimationFrame(() => showGroup(0));

  /* ---------------- experience timeline ---------------- */
  const tl = $("#timeline");
  tl.insertAdjacentHTML("beforeend", P.experience.map((j, i) => `<li class="job reveal${i === 0 ? " open" : ""}">
    <div class="job-btn">
      <div class="job-top"><h3>${esc(j.role)}</h3><span class="when">${esc(j.period)}</span></div>
      <span class="co">${esc(j.company)}</span>
      <p class="sum">${esc(j.summary)}</p>
      <div class="more" id="jm${i}"><div>
        ${j.points?.length ? `<ul>${j.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        ${j.tags?.length ? `<div class="tags">${j.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
      </div></div>
      ${j.points?.length || j.tags?.length ? `<button class="exp" aria-expanded="${i === 0}" aria-controls="jm${i}">${i === 0 ? "Show less" : "Show details"}</button>` : ""}
    </div></li>`).join(""));
  tl.addEventListener("click", e => {
    const card = e.target.closest(".job-btn"); if (!card || !$(".exp", card)) return;
    const li = card.parentElement, open = li.classList.toggle("open"), ex = $(".exp", card);
    ex.setAttribute("aria-expanded", open); ex.textContent = open ? "Show less" : "Show details";
  });
  const tlFillEl = $("#tlFill");
  function timelineFill() {
    const r = tl.getBoundingClientRect(), mid = innerHeight * .6;
    const k = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    tlFillEl.style.height = (k * 100) + "%";
    $$(".job", tl).forEach(j => j.classList.toggle("lit", j.getBoundingClientRect().top < mid));
  }

  /* ---------------- education, honors, certifications ---------------- */
  const eduEl = $("#eduGrid"), [eduMain, ...eduRest] = P.education || [];
  if (eduMain) {
    eduEl.innerHTML = `
      <article class="edu-hero reveal">
        <span class="edu-crest" aria-hidden="true">${esc(eduMain.school.charAt(0))}</span>
        <p class="kicker light">${esc(eduMain.degree)}${eduMain.field ? ` · ${esc(eduMain.field)}` : ""}</p>
        <h3>${esc(eduMain.school)}</h3>
        <p class="edu-meta">${esc(eduMain.place)} · ${esc(eduMain.period)}</p>
        ${eduMain.note ? `<p class="edu-note">${esc(eduMain.note)}</p>` : ""}
      </article>
      <div class="edu-side">
        ${eduRest.map(e => `<article class="edu-card card reveal"><p class="kicker">${esc(e.degree)}${e.field ? ` · ${esc(e.field)}` : ""}</p>
          <h4>${esc(e.school)}</h4><p class="edu-meta">${esc(e.place)} · ${esc(e.period)}</p>${e.note ? `<p class="edu-small">${esc(e.note)}</p>` : ""}</article>`).join("")}
        ${(P.honors || []).map(h => `<article class="edu-card honor card reveal"><span class="medal" aria-hidden="true">🏅</span><div><p class="kicker">Honor · ${esc(h.year)}</p>
          <h4>${esc(h.title)}</h4><p class="edu-small">${esc(h.detail)}</p></div></article>`).join("")}
        ${P.certifications?.length ? `<article class="edu-card card reveal"><p class="kicker">Certifications</p>
          <ul class="certs">${P.certifications.map(c => `<li><span><b>${esc(c.name)}</b><small>${esc(c.issuer)}</small></span><span class="yr">${esc(c.year)}</span></li>`).join("")}</ul></article>` : ""}
      </div>`;
  } else $("#education").hidden = true;

  /* ---------------- work carousel + modal ---------------- */
  const car = $("#carousel"), cases = P.caseStudies;
  const cats = ["All", ...new Set(cases.map(c => c.area.split("·")[0].trim()))];
  $("#workFilters").innerHTML = cats.map((c, i) => `<button role="tab" data-f="${esc(c)}" class="${i === 0 ? "on" : ""}" aria-selected="${i === 0}">${esc(c)}</button>`).join("");
  car.innerHTML = cases.map(c => {
    const first = c.results?.[0], cover = c.gallery?.[0]?.src;
    return `<article class="case" tabindex="0" role="link" aria-label="Open case study: ${esc(c.title)}" data-case="${esc(c.id)}" data-cat="${esc(c.area.split("·")[0].trim())}">
      <span class="cover">${cover ? `<img src="${esc(cover)}" alt="" loading="lazy">` : ""}<span class="yr">${esc(c.year)}</span>
        ${first ? `<span><span class="big" style="display:block">${esc(first.value)}</span><span class="lbl">${esc(first.label)}</span></span>` : ""}</span>
      <span class="meta">${esc(c.area)} · ${esc(c.system)}</span>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.problem)}</p>
      <span class="open">Open case study →</span>
    </article>`;
  }).join("");
  $("#workFilters").addEventListener("click", e => {
    const b = e.target.closest("[data-f]"); if (!b) return;
    $$("#workFilters button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
    $$(".case", car).forEach((c, i) => {
      const show = b.dataset.f === "All" || c.dataset.cat === b.dataset.f;
      c.classList.toggle("hide", !show);
      if (show) { c.classList.remove("enter"); void c.offsetWidth; c.style.animationDelay = (i * 60) + "ms"; c.classList.add("enter"); }
    });
    car.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" });
  });
  const stepCar = d => { const c = $(".case:not(.hide)", car); car.scrollBy({ left: d * ((c?.offsetWidth || 400) + 20), behavior: reduced ? "auto" : "smooth" }); };
  $("#carPrev").addEventListener("click", () => stepCar(-1));
  $("#carNext").addEventListener("click", () => stepCar(1));
  car.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") stepCar(1); if (e.key === "ArrowLeft") stepCar(-1);
    const c = e.target.closest?.("[data-case]"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCase(c.dataset.case); }
  });
  // drag to scroll (mouse)
  let drag = null, moved = false;
  car.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse" || e.button !== 0) return; drag = { x: e.clientX, s: car.scrollLeft }; moved = false; });
  addEventListener("pointermove", e => {
    if (!drag) return; const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5) { moved = true; car.classList.add("dragging"); }
    if (moved) car.scrollLeft = drag.s - dx;
  });
  addEventListener("pointerup", () => { if (!drag) return; drag = null; car.classList.remove("dragging"); });
  car.addEventListener("click", e => {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; }
    const c = e.target.closest("[data-case]"); if (c) openCase(c.dataset.case);
  }, true);
  if (finePointer && !reduced) $$(".case", car).forEach(c => {
    c.addEventListener("pointermove", e => { if (drag) return; const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`; });
    c.addEventListener("pointerleave", () => c.style.transform = "");
  });

  const modal = $("#modal"), mBody = $("#modalBody");
  let lastFocus = null;
  function openCase(id) {
    const c = cases.find(x => x.id === id); if (!c) return;
    lastFocus = document.activeElement;
    mBody.innerHTML = `<p class="kicker">${esc(c.area)} · ${esc(c.system)} · ${esc(c.year)}</p>
      <h3 id="modalTitle">${esc(c.title)}</h3>
      ${c.results?.length ? `<div class="m-results">${c.results.map(r => `<div><b>${esc(r.value)}</b><small>${esc(r.label)}</small></div>`).join("")}</div>` : ""}
      <section><p class="kicker" style="margin-bottom:6px">The problem</p><p style="font-size:17px;color:var(--ink-2);max-width:64ch">${esc(c.problem)}</p></section>
      ${c.approach?.length ? `<section><p class="kicker" style="margin-bottom:10px">What I did</p><ol class="steps">${c.approach.map(a => `<li><span>${esc(a)}</span></li>`).join("")}</ol></section>` : ""}
      ${c.mindmap ? `<section><p class="kicker" style="margin-bottom:10px">Scope mind map</p><div class="mm-host"></div>
        ${c.mindmap.image ? `<button class="btn ghost small" style="margin-top:12px" data-lightbox="${esc(c.mindmap.image)}" data-cap="Original mind map" data-tall>View the original mind map</button>` : ""}</section>` : ""}
      ${c.gallery?.length ? `<section><p class="kicker" style="margin-bottom:10px">Prototype</p><div class="gallery">${c.gallery.map(g => `<button class="shot" data-lightbox="${esc(g.src)}" data-cap="${esc(g.caption)}"><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><span>${esc(g.caption)}</span></button>`).join("")}</div></section>` : ""}
      ${c.prototype ? `<a class="btn primary proto" href="${esc(c.prototype.href)}" target="_blank" rel="noopener" hidden>${esc(c.prototype.label)} ↗</a>` : ""}
      ${c.tags?.length ? `<div class="tagrow">${c.tags.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>` : ""}`;
    if (c.mindmap && window.renderMindmap) renderMindmap($(".mm-host", mBody), c.mindmap);
    const pl = $(".proto", mBody);
    if (pl) fetch(pl.getAttribute("href"), { method: "HEAD" }).then(r => { if (r.ok) pl.hidden = false; }).catch(() => {});
    showModal(c.title);
  }
  function showModal(title) {
    resetWin("modal"); $("#modalWinTitle").textContent = title;
    modal.hidden = false; document.body.style.overflow = "hidden";
    $(".modal-card", modal).scrollTop = 0; $("#modalX").focus();
  }
  function closeModal() { if (modal.hidden) return; unRun("modal"); modal.hidden = true; document.body.style.overflow = ""; lastFocus?.focus?.(); }
  $("#modalX").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

  const lb = $("#lightbox");
  function openLightbox(src, cap, tall) { const img = $("img", lb); img.src = src; img.alt = cap || ""; $("figcaption", lb).textContent = cap || ""; lb.classList.toggle("tall", !!tall); lb.scrollTop = 0; lb.hidden = false; $(".lb-close", lb).focus(); }
  function closeLightbox() { if (lb.hidden) return; lb.hidden = true; $("img", lb).removeAttribute("src"); }
  lb.addEventListener("click", e => { if (!e.target.closest("img")) closeLightbox(); });
  document.addEventListener("click", e => { const L = e.target.closest("[data-lightbox]"); if (L) openLightbox(L.dataset.lightbox, L.dataset.cap, "tall" in L.dataset); });

  /* ---------------- methodology: explore ---------------- */
  const M = P.methodology;
  if (M) {
    $("#methodLede").textContent = M.intro;
    const n = M.phases.length, gate = M.phases.findIndex(x => x.decision);
    const num = i => M.phases.slice(0, i + 1).filter(x => !x.decision).length;
    const total = M.phases.filter(x => !x.decision).length;
    const ex = $("#methodExplore");
    ex.innerHTML = `<ol class="flow">${M.phases.map((ph, i) => `<li><button class="phase${ph.decision ? " gate" : ""}" data-i="${i}"><span class="pn">${ph.decision ? "?" : num(i)}</span><span class="pt">${esc(ph.name)}</span></button></li>`).join("")}</ol>
      <div class="phase-meter"><i></i></div>
      <div class="phase-card card"><div class="pc"></div><div class="pc-actions">
        <button class="btn primary small" id="mPlay">▶ Walk through a project</button>
        <button class="btn ghost small" id="mNext">Next phase →</button>
        ${M.image ? `<button class="btn ghost small" data-lightbox="${esc(M.image)}" data-cap="Odoo Implementation Methodology">Original diagram</button>` : ""}
      </div></div>`;
    let cur = 0, timer = null;
    const show = (i, seen) => {
      cur = i;
      $$(".phase", ex).forEach((b, k) => { b.classList.toggle("on", k === i); b.classList.toggle("done", !!seen && seen.has(k) && k !== i); b.setAttribute("aria-current", k === i ? "step" : "false"); });
      $(".phase-meter i", ex).style.width = ((i + 1) / n * 100) + "%";
      const ph = M.phases[i];
      $(".pc", ex).outerHTML = `<div class="pc"><p class="kicker">${ph.decision ? "Review gate" : `Phase ${num(i)} of ${total}`}</p><h3>${esc(ph.name)}</h3>
        <ul class="checks">${ph.tasks.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
        ${ph.decision ? `<div class="outcomes"><button data-i="${i + 1}">Approved → ${esc(M.phases[i + 1]?.name || "")}</button><button class="warn" data-i="${ph.loopTo}">Changes required → ${esc(M.phases[ph.loopTo]?.name || "")}</button></div>` : ""}</div>`;
      // scroll only the phase strip sideways, never the page
      const on = $(".phase.on", ex), fl = $(".flow", ex);
      if (on && fl.scrollWidth > fl.clientWidth) {
        const a = on.getBoundingClientRect(), f = fl.getBoundingClientRect();
        fl.scrollTo({ left: fl.scrollLeft + (a.left - f.left) - f.width / 2 + a.width / 2, behavior: reduced ? "auto" : "smooth" });
      }
    };
    const stop = () => { clearTimeout(timer); timer = null; $("#mPlay").textContent = "▶ Walk through a project"; };
    const play = () => {
      const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
      const seq = gate >= 0 ? [...range(0, gate), ...range(M.phases[gate].loopTo, gate), ...range(gate + 1, n - 1)] : range(0, n - 1);
      const seen = new Set(); let k = 0; $("#mPlay").textContent = "■ Stop";
      const step = () => {
        const i = seq[k], prev = seq[k - 1];
        if (prev === gate && i === M.phases[gate].loopTo) toast(`Changes required: back to ${M.phases[i].name}`);
        seen.add(i); show(i, seen);
        if (++k < seq.length) timer = setTimeout(step, reduced ? 700 : 1300); else { stop(); toast("🎉 Live on Odoo. Hypercare, then a clean handover."); }
      };
      step();
    };
    ex.addEventListener("click", e => {
      if (e.target.closest("#mPlay")) return timer ? stop() : play();
      if (e.target.closest("#mNext")) { stop(); return show((cur + 1) % n); }
      const b = e.target.closest("[data-i]"); if (b) { stop(); show(+b.dataset.i); }
    });
    show(0);

    /* methodology: drag-and-drop game */
    const game = $("#methodGame");
    const correct = M.phases.map((_, i) => i);
    const shuffle = () => { let a; do { a = [...correct].sort(() => Math.random() - .5); } while (a.every((v, i) => v === i)); return a; };
    const grip = '<svg viewBox="0 0 16 16"><circle cx="5" cy="3" r="1.4"/><circle cx="11" cy="3" r="1.4"/><circle cx="5" cy="8" r="1.4"/><circle cx="11" cy="8" r="1.4"/><circle cx="5" cy="13" r="1.4"/><circle cx="11" cy="13" r="1.4"/></svg>';
    const renderGame = () => {
      game.innerHTML = `<div class="game-head"><p>Drag the phases into the order I use on real projects. Then check your answer.</p>
        <div class="btn-row" style="display:flex;gap:8px"><button class="btn ghost small" id="gShuffle">Shuffle</button><button class="btn primary small" id="gCheck">Check my order</button></div></div>
        <ol class="sortable" id="sortList">${shuffle().map(i => `<li data-i="${i}"><span class="grip" aria-label="Drag ${esc(M.phases[i].name)}">${grip}</span><span class="num"></span><span class="nm">${esc(M.phases[i].name)}</span>
          <span class="mv"><button data-mv="-1" aria-label="Move ${esc(M.phases[i].name)} up">↑</button><button data-mv="1" aria-label="Move ${esc(M.phases[i].name)} down">↓</button></span></li>`).join("")}</ol>
        <p class="game-res" id="gRes" aria-live="polite"></p>`;
      renumber(); wireSort($("#sortList"));
    };
    const renumber = () => $$("#sortList li").forEach((li, k) => { $(".num", li).textContent = k + 1; li.classList.remove("ok", "bad"); });
    function wireSort(list) {
      list.addEventListener("click", e => {
        const b = e.target.closest("[data-mv]"); if (!b) return;
        const li = b.closest("li"), d = +b.dataset.mv;
        if (d < 0 && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
        if (d > 0 && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
        renumber(); b.focus();
      });
      list.addEventListener("pointerdown", e => {
        const g = e.target.closest(".grip"); if (!g || e.button !== 0) return;
        e.preventDefault();
        const li = g.closest("li"), items = $$("li", list), from = items.indexOf(li);
        const rects = items.map(x => x.getBoundingClientRect()), h = rects[from].height, gap = 8, y0 = e.clientY;
        let to = from;
        li.classList.add("lift"); try { g.setPointerCapture(e.pointerId); } catch {}
        const move = ev => {
          const dy = ev.clientY - y0; li.style.transform = `translateY(${dy}px) scale(1.02)`;
          const center = rects[from].top + h / 2 + dy;
          to = items.filter((x, k) => k !== from && (rects[k].top + rects[k].height / 2) < center).length;
          items.forEach((x, k) => {
            if (k === from) return;
            let s = 0; if (from < to && k > from && k <= to) s = -(h + gap); if (to < from && k >= to && k < from) s = h + gap;
            x.style.transform = s ? `translateY(${s}px)` : "";
          });
        };
        const up = () => {
          g.removeEventListener("pointermove", move); g.removeEventListener("pointerup", up); g.removeEventListener("pointercancel", up);
          items.forEach(x => { x.style.transition = "none"; x.style.transform = ""; });
          li.classList.remove("lift");
          const rest = items.filter(x => x !== li); rest.splice(to, 0, li); rest.forEach(x => list.append(x));
          renumber();
          requestAnimationFrame(() => items.forEach(x => x.style.transition = ""));
        };
        g.addEventListener("pointermove", move); g.addEventListener("pointerup", up); g.addEventListener("pointercancel", up);
      });
    }
    game.addEventListener("click", e => {
      if (e.target.closest("#gShuffle")) { renderGame(); return; }
      if (!e.target.closest("#gCheck")) return;
      const lis = $$("#sortList li"); let ok = 0;
      lis.forEach((li, k) => { const good = +li.dataset.i === k; li.classList.toggle("ok", good); li.classList.toggle("bad", !good); if (good) ok++; });
      const res = $("#gRes");
      if (ok === lis.length) { res.textContent = "Perfect! You think like an implementer. 🎉"; confetti(); }
      else res.textContent = `${ok} of ${lis.length} in the right place. Hint: the review gate comes before any data is migrated.`;
    });
    const lab = $("#methodLab");
    $("#methodTabs").addEventListener("click", e => {
      const b = e.target.closest("[data-mt]"); if (!b) return;
      $$("#methodTabs button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
      const t = b.dataset.mt;
      ex.hidden = t !== "explore"; game.hidden = t !== "game"; lab.hidden = t !== "lab";
      if (t === "game" && !game.firstChild) renderGame();
      if (t === "lab" && !lab.firstChild) renderLab(lab);
    });
    if (!P.processes?.length) $('[data-mt="lab"]').hidden = true;
  } else $("#methodology").hidden = true;

  /* ---------------- Process Lab: as-is vs to-be swimlanes ---------------- */
  function renderLab(host) {
    let proc = P.processes[0], mode = "asIs", running = false;
    host.innerHTML = `<div class="lab">
      <p class="sec-lede" style="font-size:16px">Pick a process, switch between <b>As-is</b> and <b>To-be</b>, then run it. Dashed red steps are manual pain points. This is how I show teams where the time goes.</p>
      <div class="lab-bar">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          ${P.processes.length > 1 ? `<select aria-label="Process" id="labProc">${P.processes.map(x => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join("")}</select>` : ""}
          <div class="seg mini" role="tablist"><button class="on" data-m="asIs" role="tab">As-is</button><button data-m="toBe" role="tab">To-be</button></div>
        </div>
        <button class="btn primary small" id="labRun">▶ Run process</button>
      </div>
      <div class="map card"></div>
      <div class="lab-legend"><span><i></i>Step</span><span><i class="m"></i>Manual pain point</span><span id="labNote"></span></div>
      <div class="metrics"></div>
    </div>`;
    const mapEl = $(".map", host), metEl = $(".metrics", host);
    const LH = 66, PADL = 112, COL = 152, NW = 128, NH = 36;
    const draw = () => {
      const flow = proc[mode], steps = flow.steps, lanes = proc.lanes;
      const nx = i => PADL + 54 + i * COL, ny = l => l * LH + (LH - NH) / 2, mid = l => l * LH + LH / 2;
      const W = nx(steps.length - 1) + NW + 70, H = lanes.length * LH;
      const sx = PADL + 22, sy = mid(steps[0].lane), ex2 = nx(steps.length - 1) + NW + 40, ey = mid(steps[steps.length - 1].lane);
      const edges = [`M${sx + 9} ${sy} H${nx(0)}`], route = [`M${sx + 9} ${sy}`, `H${nx(0)}`];
      steps.forEach((s, i) => {
        const x1 = nx(i) + NW, y1 = mid(s.lane); route.push(`H${x1}`);
        if (i < steps.length - 1) {
          const x2 = nx(i + 1), y2 = mid(steps[i + 1].lane), m = x1 + (COL - NW) / 2;
          edges.push(y1 === y2 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} H${m} V${y2} H${x2}`);
          route.push(y1 === y2 ? `H${x2}` : `H${m} V${y2} H${x2}`);
        } else { edges.push(`M${x1} ${y1} H${ex2 - 11}`); route.push(`H${ex2 - 11}`); }
      });
      mapEl.innerHTML = `<svg style="width:100%;height:auto;min-width:${Math.round(W * .72)}px" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(proc.name)} ${mode === "asIs" ? "as-is" : "to-be"} process with ${steps.length} steps">
        <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" style="fill:var(--muted)"/></marker></defs>
        ${lanes.map((l, i) => `<text class="lane-l" x="14" y="${mid(i) + 4}">${esc(l)}</text>${i ? `<line class="lane-line" x1="0" x2="${W}" y1="${i * LH}" y2="${i * LH}"/>` : ""}`).join("")}
        <line class="lane-line" x1="${PADL}" x2="${PADL}" y1="0" y2="${H}"/>
        ${edges.map((d, i) => `<path class="edge" d="${d}" marker-end="url(#ah)" style="animation-delay:${i * 70}ms"/>`).join("")}
        <circle class="ev" cx="${sx}" cy="${sy}" r="9"/><circle class="ev end" cx="${ex2}" cy="${ey}" r="10"/>
        ${steps.map((s, i) => `<g class="node grow${s.manual ? " manual" : ""}" style="animation-delay:${i * 80}ms" data-x="${nx(i)}">
          <rect x="${nx(i)}" y="${ny(s.lane)}" width="${NW}" height="${NH}" rx="10"/>
          <text x="${nx(i) + NW / 2}" y="${ny(s.lane) + NH / 2 + 4}" text-anchor="middle">${esc(s.label)}</text></g>`).join("")}
        <path id="route" d="${route.join(" ")}" fill="none" stroke="none"/>
        <circle class="token" r="7" cx="${sx}" cy="${sy}" opacity="0"/></svg>`;
      const before = proc.asIs.metrics, now = flow.metrics;
      metEl.innerHTML = Object.keys(now).map(k => `<div class="metric card"><small>${esc(k)}</small><b>${esc(now[k])}</b>${mode === "toBe" && before[k] && before[k] !== now[k] ? `<span class="was">${esc(before[k])}</span>` : ""}</div>`).join("") +
        (proc.sample ? `<p class="rnote" style="grid-column:1/-1">Illustrative example, not client data.</p>` : "");
      $("#labNote", host).textContent = `${steps.length} steps · ${steps.filter(s => s.manual).length} manual`;
    };
    const run = () => {
      if (running) return;
      const svg = $("svg", mapEl), path = $("#route", svg), tok = $(".token", svg), nodes = $$(".node", svg);
      nodes.forEach(n => n.classList.remove("hit"));
      const L = path.getTotalLength(), dur = reduced ? 1 : proc[mode].steps.length * 650 + 400, btn = $("#labRun", host);
      running = true; tok.setAttribute("opacity", "1"); btn.disabled = true; btn.textContent = "Running…";
      const t0 = performance.now();
      const tick = now => {
        const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, pt = path.getPointAtLength(e * L);
        tok.setAttribute("cx", pt.x); tok.setAttribute("cy", pt.y);
        nodes.forEach(n => { if (pt.x >= +n.dataset.x + 4) n.classList.add("hit"); });
        if (k < 1) requestAnimationFrame(tick);
        else { running = false; btn.disabled = false; btn.textContent = "▶ Run again"; const ct = proc[mode].metrics["Cycle time"]; toast(mode === "asIs" ? `As-is finished: ${ct}. Now try To-be.` : `To-be finished: ${ct}.`); }
      };
      requestAnimationFrame(tick);
    };
    host.addEventListener("click", e => {
      const m = e.target.closest("[data-m]");
      if (m && !running) { mode = m.dataset.m; $$("[data-m]", host).forEach(b => b.classList.toggle("on", b === m)); $("#labRun", host).textContent = "▶ Run process"; draw(); }
      if (e.target.closest("#labRun")) run();
    });
    $("#labProc", host)?.addEventListener("change", e => { if (running) { e.target.value = proc.id; return; } proc = P.processes.find(x => x.id === e.target.value); draw(); });
    draw();
  }

  /* confetti */
  function confetti() {
    if (reduced) return toast("🎉");
    const c = $("#confetti"), ctx = c.getContext("2d"), d = Math.min(devicePixelRatio || 1, 2);
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

  /* ---------------- research ---------------- */
  const R = P.research;
  if (R) {
    $("#resTitle").textContent = R.title;
    $("#resLede").textContent = R.summary;
    const MIN = -0.4, MAX = 0.8, span = MAX - MIN, pos = v => ((v - MIN) / span) * 100;
    const f2 = v => (v < 0 ? "−" : "") + Math.abs(v).toFixed(2);
    const bar = (v, cls, lab) => `<span class="rb ${cls}" tabindex="0" data-tip="${esc(lab)}: ${f2(v)}" style="margin-left:${pos(Math.min(0, v))}%;width:${(Math.abs(v) / span) * 100}%;transform-origin:${v < 0 ? "right" : "left"}"><i class="rv${v < 0 ? " neg" : ""}" style="font-style:normal">${f2(v)}</i></span>`;
    const sp = s => ((s - 1) / 4) * 100;
    $("#resGrid").innerHTML = `
      <div class="res-side">
        <p class="rnote">${esc(R.degree)} · ${esc(R.school)} · ${esc(R.year)}<br>${esc(R.formalTitle)}</p>
        <div class="res-stats">${R.stats.map(s => `<div class="reveal"><b>${esc(s.value)}</b><small>${esc(s.label)}</small></div>`).join("")}</div>
        <blockquote class="insight reveal" style="margin:0"><p class="kicker">Key finding</p><p>${esc(R.insight)}</p></blockquote>
        ${R.slides ? `<a class="btn ghost small" style="justify-self:start" href="${esc(R.slides)}" target="_blank" rel="noopener">Defense slides (Persian, PDF) ↗</a>` : ""}
      </div>
      <div class="res-main">
        <div class="chart-card card reveal"><h3>What predicts a successful rollout</h3>
          <div class="legend"><span><i class="k1"></i>Effect on its own</span><span><i class="k2"></i>Effect with the other drivers</span></div>
          <div class="rchart" role="img" aria-label="${esc(R.drivers.map(d => `${d.name}: ${f2(d.alone)} on its own, ${f2(d.together)} with the other drivers`).join(". "))}">
            ${R.drivers.map(d => `<div class="rrow"><div class="rname">${esc(d.name)}</div><div class="rtrack"><span class="zero" style="left:${pos(0)}%"></span><div class="rpair">${bar(d.alone, "b1", "On its own")}${bar(d.together, "b2", "With the other drivers")}</div></div></div>`).join("")}
            <div class="rrow raxis"><div></div><div class="rtrack">${[-0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8].map(t => `<span style="left:${pos(t)}%">${f2(t)}</span>`).join("")}</div></div>
          </div>
          <p class="rnote">${esc(R.driversNote)}</p></div>
        <div class="chart-card card reveal"><h3>How Shoniz scored today <small>(1 to 5, 3 is neutral)</small></h3>
          <div class="rchart" role="img" aria-label="${esc(R.current.map(c => `${c.name}: ${c.score}`).join(". "))}">
            ${R.current.map(c => `<div class="rrow"><div class="rname">${esc(c.name)}${c.flag ? `<small class="rflag">${esc(c.flag)}</small>` : ""}</div><div class="rtrack"><span class="zero mid" style="left:${sp(3)}%"></span><div class="rpair"><span class="rb b1" tabindex="0" data-tip="${esc(c.name)}: ${c.score.toFixed(2)} of 5" style="width:${sp(c.score)}%"><i class="rv" style="font-style:normal">${c.score.toFixed(2)}</i></span></div></div></div>`).join("")}
            <div class="rrow raxis"><div></div><div class="rtrack">${[1, 2, 3, 4, 5].map(t => `<span style="left:${sp(t)}%">${t}</span>`).join("")}</div></div>
          </div></div>
        <div class="recs">${R.recommendations.map((r, i) => `<article class="rec card reveal"><span class="n">${i + 1}</span><h4>${esc(r.title)}</h4><ul class="checks">${r.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul></article>`).join("")}</div>
        <div class="tagrow">${R.methods.map(m => `<span class="chip">${esc(m)}</span>`).join("")}</div>
      </div>`;
    const chartIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("on"); chartIO.unobserve(en.target); } }), { threshold: .35 });
    $$(".rchart").forEach(c => { if (reduced) c.classList.add("on"); else chartIO.observe(c); });
    const tip = document.createElement("div"); tip.className = "tip"; tip.hidden = true; document.body.append(tip);
    const showTip = el => { const r = el.getBoundingClientRect(); tip.textContent = el.dataset.tip; tip.hidden = false; tip.style.left = (r.left + r.width / 2) + "px"; tip.style.top = r.top + "px"; };
    $$(".rb").forEach(el => {
      el.addEventListener("pointerenter", () => showTip(el)); el.addEventListener("focus", () => showTip(el));
      el.addEventListener("pointerleave", () => tip.hidden = true); el.addEventListener("blur", () => tip.hidden = true);
    });
    addEventListener("scroll", () => { tip.hidden = true; }, { passive: true });
  } else $("#research").hidden = true;

  /* ---------------- services + planner ---------------- */
  const S = P.services;
  if (S) {
    $("#svcGrid").innerHTML = S.items.map((s, i) => `<article class="svc card reveal">
      <span class="n">0${i + 1}</span><h3>${esc(s.name)}</h3><p class="tagl">${esc(s.tagline)}</p><p class="t">${esc(s.text)}</p>
      <ul class="checks">${s.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <span class="price">${esc(s.pricing)}</span>
      <button class="btn ghost small pick" data-pick="${i}">Plan this →</button></article>`).join("");
    if (S.image) $("#svcGrid").insertAdjacentHTML("afterend", `<p style="margin-top:14px"><button class="btn ghost small" data-lightbox="${esc(S.image)}" data-cap="Odoo services">View the original services sheet</button></p>`);
    if (finePointer) $$(".svc").forEach(c => c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); }));

    const MODS = ["Inventory", "Purchase", "Manufacturing", "Sales", "Accounting", "CRM", "HR", "POS", "Project"];
    const STARTS = ["As soon as possible", "Within 1–3 months", "Just exploring"];
    const st = { svc: 0, mods: new Set(["Inventory", "Purchase"]), users: 30, start: 1 };
    $("#planner").innerHTML = `<div class="pl-form"><div><p class="kicker">Project planner</p><h3>Sketch your Odoo project in 20 seconds.</h3></div>
        <div class="pl-group"><span>Service</span><div class="toggles" id="plSvc">${S.items.map((s, i) => `<button data-v="${i}" aria-pressed="${i === 0}">${esc(s.name)}</button>`).join("")}</div></div>
        <div class="pl-group"><span>Modules</span><div class="toggles" id="plMods">${MODS.map(m => `<button data-v="${m}" aria-pressed="${st.mods.has(m)}">${m}</button>`).join("")}</div></div>
        <div class="pl-group"><span>Users: <b id="plUsersV">${st.users}</b></span><input type="range" id="plUsers" min="5" max="500" step="5" value="${st.users}" aria-label="Number of users"></div>
        <div class="pl-group"><span>Start</span><div class="toggles" id="plStart">${STARTS.map((s, i) => `<button data-v="${i}" aria-pressed="${i === st.start}">${s}</button>`).join("")}</div></div></div>
      <div class="pl-out"><p class="kicker">Your message</p><pre id="plText"></pre>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary small" id="plCopy">Copy message</button><a class="btn ghost small" id="plMail" href="#">Open in email</a></div>
        <p class="rnote">Send it to ${esc(p.email)}</p></div>`;
    const draw = () => {
      const text = `Hi ${p.name.split(" ")[0]},\n\nWe're interested in: ${S.items[st.svc].name}\nModules: ${[...st.mods].join(", ") || "not sure yet"}\nUsers: about ${st.users}\nStart: ${STARTS[st.start].toLowerCase()}\n\nCompany:\nMy name:`;
      $("#plText").textContent = text;
      $("#plMail").href = `mailto:${p.email}?subject=${encodeURIComponent("Odoo project: " + S.items[st.svc].name)}&body=${encodeURIComponent(text)}`;
    };
    const single = (id, key) => $(id).addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; st[key] = +b.dataset.v; $$(id + " button").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
    single("#plSvc", "svc"); single("#plStart", "start");
    $("#plMods").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const v = b.dataset.v; st.mods.has(v) ? st.mods.delete(v) : st.mods.add(v); b.setAttribute("aria-pressed", st.mods.has(v)); draw(); });
    $("#plUsers").addEventListener("input", e => { st.users = +e.target.value; $("#plUsersV").textContent = st.users; draw(); });
    $("#plCopy").addEventListener("click", () => copy($("#plText").textContent, "Message copied. Paste it into an email."));
    $("#svcGrid").addEventListener("click", e => {
      const b = e.target.closest("[data-pick]"); if (!b) return;
      st.svc = +b.dataset.pick; $$("#plSvc button").forEach(x => x.setAttribute("aria-pressed", +x.dataset.v === st.svc)); draw();
      $("#planner").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    });
    draw();
  } else $("#services").hidden = true;

  function copy(text, msg) {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => toast(msg), () => toast("Select the text and copy it with Ctrl/Cmd + C."));
    else toast("Select the text and copy it with Ctrl/Cmd + C.");
  }

  /* ---------------- contact + footer ---------------- */
  $("#contactRow").innerHTML = `${p.location ? `<span class="loc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>${esc(p.location)}</span>` : ""}
    <span class="mail"><span>${esc(p.email)}</span><button class="btn primary small" id="cCopy">Copy</button></span>
    <a class="btn ghost" href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>
    ${p.github ? `<a class="btn ghost" href="${esc(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ""}
    ${p.cv ? `<a class="btn ghost" href="${esc(p.cv)}" target="_blank" rel="noopener">CV (PDF) ↗</a>` : ""}`;
  $("#cCopy").addEventListener("click", () => copy(p.email, "Email copied"));
  $("#year").textContent = new Date().getFullYear();

  /* ---------------- "About this portfolio" (in the MN menu) ---------------- */
  function openSpec() {
    lastFocus = document.activeElement;
    mBody.innerHTML = `<div class="spec">
      <div class="spec-photo">${p.sketch ? `<img src="${esc(p.sketch)}" alt="">` : `<span>${esc(p.initials)}</span>`}</div>
      <h3 id="modalTitle">${esc(p.name)}</h3><p class="edu-meta">Portfolio · Version 2.0</p>
      <dl>
        <dt>Role</dt><dd>${esc(p.headline)}</dd>
        <dt>Processor</dt><dd>Sharif-trained analytical engine</dd>
        <dt>Memory</dt><dd>${P.experience.length} roles · ${cases.length} case studies</dd>
        <dt>Graphics</dt><dd>Graphite glass with an electric-blue accent</dd>
        <dt>Startup disk</dt><dd>content.js</dd>
      </dl>
      <p class="edu-small">Every section reads from one content file, so new projects appear without touching the design. Try the Terminal from the MN menu, or press the <kbd>\`</kbd> key.</p>
    </div>`;
    showModal("About This Portfolio");
  }

  /* ---------------- Terminal (easter egg) ---------------- */
  const termWrap = $("#termWrap"), termOut = $("#termOut"), termIn = $("#termIn"), term = $("#term");
  const hist = []; let hi = 0, termBooted = false;
  const tprint = html => { termOut.insertAdjacentHTML("beforeend", `<pre>${html}</pre>`); term.scrollTop = term.scrollHeight; };
  const SECTIONS = Object.keys(SECTION_NAMES).filter(k => k !== "top");
  const CMDS = {
    help: () => `<span class="y">Commands</span>
  whoami        who I am
  experience    my roles
  education     where I studied
  projects      case studies
  skills        what I work with
  methodology   how I implement Odoo
  research      my ERP thesis in one line
  services      ways to work with me
  contact       how to reach me
  open &lt;name&gt;   jump to a section (${SECTIONS.join(", ")})
  theme &lt;mode&gt;  light, dark or auto
  clear         clear the screen
  exit          close the terminal`,
    whoami: () => `${esc(p.name)}\n<span class="m">${esc(p.headline)}</span>\n${esc(p.tagline)}`,
    experience: () => P.experience.map(j => `<span class="p">${esc(j.period.padEnd(20))}</span>${esc(j.role)} <span class="m">@ ${esc(j.company.split("·")[0].trim())}</span>`).join("\n"),
    education: () => [...(P.education || []).map(e => `<span class="p">${esc(e.period.padEnd(14))}</span>${esc(e.degree)}${e.field ? ", " + esc(e.field) : ""} <span class="m">· ${esc(e.school)}</span>`), ...(P.honors || []).map(h => `<span class="y">🏅 ${esc(h.title)}</span>`)].join("\n"),
    projects: () => cases.map(c => `<span class="y">●</span> ${esc(c.title)}${c.results?.[0] ? ` <span class="m">→ ${esc(c.results[0].value)} ${esc(c.results[0].label)}</span>` : ""}`).join("\n"),
    skills: () => P.skills.map(g => `<span class="p">${esc(g.group)}:</span> ${g.items.map(esc).join(", ")}`).join("\n"),
    methodology: () => (P.methodology?.phases || []).map((x, i) => `<span class="p">${String(i + 1).padStart(2, "0")}</span> ${esc(x.name)}`).join("\n"),
    research: () => P.research ? `<span class="y">${esc(P.research.title)}</span>\n${esc(P.research.insight)}` : "No research yet.",
    services: () => (P.services?.items || []).map(s => `<span class="y">●</span> ${esc(s.name)} <span class="m">· ${esc(s.pricing)}</span>`).join("\n"),
    contact: () => `email     ${esc(p.email)}\nlinkedin  ${esc(p.linkedin)}${p.location ? `\nbased in  ${esc(p.location)}` : ""}`,
    date: () => new Date().toString(),
    clear: () => { termOut.innerHTML = ""; return null; },
    exit: () => { closeTerm(); return null; },
    "sudo hire-me": () => { setTimeout(() => { closeTerm(); go("contact")(); }, 600); return `<span class="y">Permission granted.</span> Taking you to contact…`; }
  };
  const texec = raw => {
    const cmd = raw.trim(); if (!cmd) return tprint(`<span class="p">guest@portfolio ~ %</span>`);
    hist.push(cmd); hi = hist.length;
    tprint(`<span class="p">guest@portfolio ~ %</span> ${esc(cmd)}`);
    const [a, b] = cmd.toLowerCase().split(/\s+/);
    if (a === "open") { const id = SECTIONS.find(s => s === b || SECTION_NAMES[s].toLowerCase().startsWith(b || "-")); if (!id) return tprint(`open: no section called "${esc(b || "")}"`); tprint(`Opening ${SECTION_NAMES[id]}…`); setTimeout(() => { closeTerm(); go(id)(); }, 350); return; }
    if (a === "theme") { if (!["light", "dark", "auto"].includes(b)) return tprint("usage: theme light | dark | auto"); setTheme(b); return tprint(`Appearance set to ${b}.`); }
    const f = CMDS[cmd.toLowerCase()] || CMDS[a];
    if (!f) return tprint(`zsh: command not found: ${esc(a)}. Try <span class="y">help</span>.`);
    const r = f(); if (r != null) tprint(r);
  };
  function openTerm() {
    closeMenu(); termWrap.hidden = false;
    if (!termBooted) { termBooted = true; tprint(`<span class="m">Last login: ${new Date().toDateString()} on ttys001</span>\nWelcome. Type <span class="y">help</span> to see what you can ask.`); }
    setTimeout(() => termIn.focus(), 30);
  }
  function closeTerm() { termWrap.hidden = true; }
  termIn.addEventListener("keydown", e => {
    if (e.key === "Enter") { texec(termIn.value); termIn.value = ""; }
    else if (e.key === "ArrowUp" && hi > 0) { termIn.value = hist[--hi]; e.preventDefault(); }
    else if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); termIn.value = hist[hi] || ""; }
  });
  term.addEventListener("click", () => termIn.focus());
  $("#termClose").addEventListener("click", closeTerm);
  termWrap.addEventListener("pointerdown", e => { if (e.target === termWrap) closeTerm(); });
  $("#footName").textContent = p.name;

  /* ---------------- site windows: drag, minimize to dock, zoom (like desktop mode) ---------------- */
  const WIN = {
    modal: { wrap: modal, card: $(".modal-card", modal), bar: $("#modalBar"), glyph: GLYPH.work, label: () => $("#modalWinTitle").textContent || "Window" },
    term: { wrap: termWrap, card: $(".term-win", termWrap), bar: $("#termBar"), label: () => "Terminal",
      glyph: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m7 10 3 2.5L7 15M12.5 15.5H17"/>' }
  };
  function unRun(id) { $(`.dock-item[data-win="${id}"]`, dockIn)?.remove(); }
  function resetWin(id) { const c = WIN[id].card; c.classList.remove("maxed"); c.style.transform = ""; unRun(id); }
  function minimize(id) {
    const w = WIN[id], r = w.card.getBoundingClientRect();
    unRun(id);
    dockIn.insertAdjacentHTML("beforeend", `<a class="dock-item running" href="#" data-win="${id}" aria-label="Restore ${esc(w.label())}"><span class="dock-icon"><svg viewBox="0 0 24 24">${w.glyph}</svg></span><span class="tip">${esc(w.label())}</span></a>`);
    showDock();
    const ir = dockIn.lastElementChild.getBoundingClientRect(), from = w.card.style.transform || "none";
    w.card.animate([{ transform: from, opacity: 1 }, { transform: `${from === "none" ? "" : from} translate(${ir.left + ir.width / 2 - (r.left + r.width / 2)}px,${ir.top - (r.top + r.height / 2)}px) scale(.08)`, opacity: 0 }],
      { duration: reduced ? 1 : 420, easing: "cubic-bezier(.5,0,.75,0)" });
    // hide once the animation is over, unless the window was already restored
    setTimeout(() => {
      if (!$(`.dock-item[data-win="${id}"]`, dockIn)) return;
      w.wrap.hidden = true; if (id === "modal") document.body.style.overflow = "";
    }, reduced ? 0 : 400);
  }
  function restore(id) {
    const w = WIN[id]; unRun(id); w.wrap.hidden = false; if (id === "modal") document.body.style.overflow = "hidden";
    w.card.animate([{ opacity: 0, scale: .85 }, { opacity: 1, scale: 1 }], { duration: reduced ? 1 : 300, easing: "cubic-bezier(.2,.9,.3,1.1)" });
    if (id === "term") setTimeout(() => termIn.focus(), 30);
  }
  dockIn.addEventListener("click", e => { const it = e.target.closest("[data-win]"); if (!it) return; e.preventDefault(); restore(it.dataset.win); });
  Object.entries(WIN).forEach(([id, w]) => {
    $(".l-min", w.bar).addEventListener("click", e => { e.stopPropagation(); minimize(id); });
    const zoom = () => { w.card.classList.toggle("maxed"); w.card.style.transform = ""; };
    $(".l-max", w.bar).addEventListener("click", e => { e.stopPropagation(); zoom(); });
    w.bar.addEventListener("dblclick", e => { if (!e.target.closest("button")) zoom(); });
    w.bar.addEventListener("pointerdown", e => {
      if (e.target.closest("button") || e.button !== 0 || w.card.classList.contains("maxed") || !finePointer) return;
      const m = w.card.style.transform.match(/translate\(([-\d.]+)px, ?([-\d.]+)px\)/) || [0, 0, 0];
      const ox = +m[1], oy = +m[2], sx = e.clientX, sy = e.clientY;
      try { w.bar.setPointerCapture(e.pointerId); } catch {}
      w.card.classList.add("dragging");
      const move = ev => { w.card.style.transform = `translate(${ox + ev.clientX - sx}px, ${oy + ev.clientY - sy}px)`; };
      const up = () => { w.card.classList.remove("dragging"); w.bar.removeEventListener("pointermove", move); w.bar.removeEventListener("pointerup", up); w.bar.removeEventListener("pointercancel", up); };
      w.bar.addEventListener("pointermove", move); w.bar.addEventListener("pointerup", up); w.bar.addEventListener("pointercancel", up);
    });
  });
  function closeAll() { closeModal(); closeTerm(); closeApps(); resetWin("modal"); resetWin("term"); toast("All windows closed"); }

  /* ---------------- phone home screen (all sections as app icons) ---------------- */
  const apps = $("#apps"), appsGrid = $("#appsGrid");
  const APP_GRID = [
    ...DOCK.map(d => ({ label: d.label, glyph: GLYPH[d.id], run: go2(d.id) })),
    { label: "Process Lab", glyph: GLYPH.methodology, run: () => { go2("methodology")(); $('[data-mt="lab"]')?.click(); } },
    { label: "Phase game", glyph: '<path d="M9 3h6v4a2 2 0 1 0 0 4v4H9v-4a2 2 0 1 0 0-4z"/><path d="M5 15h14v6H5z"/>', run: () => { go2("methodology")(); $('[data-mt="game"]')?.click(); } },
    { label: "Terminal", glyph: WIN.term.glyph, run: () => openTerm() },
    { label: "About this portfolio", glyph: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.2"/>', run: () => openSpec() },
    { label: "Desktop mode", glyph: GLYPH.desktop, run: () => { location.href = "desktop.html"; } }
  ];
  function go2(id) { return () => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }
  appsGrid.innerHTML = APP_GRID.map((a, i) => `<button class="app" role="menuitem" data-app="${i}" style="animation-delay:${i * 25}ms"><span class="dock-icon"><svg viewBox="0 0 24 24">${a.glyph}</svg></span><span>${esc(a.label)}</span></button>`).join("");
  function closeApps() { apps.hidden = true; }
  appsGrid.addEventListener("click", e => { const b = e.target.closest("[data-app]"); if (!b) return; closeApps(); APP_GRID[+b.dataset.app].run(); });
  apps.addEventListener("click", e => { if (e.target === apps) closeApps(); });
  dockIn.insertAdjacentHTML("afterbegin", `<a class="dock-item apps-btn" href="#" aria-label="All sections"><span class="dock-icon"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg></span><span class="tip">All sections</span></a>`);
  $(".apps-btn", dockIn).addEventListener("click", e => { e.preventDefault(); apps.hidden ? (apps.hidden = false) : closeApps(); });

  /* ---------------- command palette ---------------- */
  const pal = $("#palette"), palIn = $("#palInput"), palList = $("#palList");
  const go = id => () => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  const ITEMS = [
    ...[["about", "About"], ["experience", "Experience"], ["work", "Case studies"], ["methodology", "Odoo methodology"], ["research", "Research"], ["services", "Services"], ["contact", "Contact"]].map(([id, t]) => ({ t, s: "Section", run: go(id) })),
    ...cases.map(c => ({ t: c.title, s: "Case study", k: [c.area, c.system, c.problem, ...(c.approach || []), ...(c.tags || [])].join(" "), run: () => openCase(c.id) })),
    ...(S?.items || []).map(s => ({ t: s.name, s: "Service", k: [s.tagline, s.text, ...s.points].join(" "), run: go("services") })),
    ...(P.methodology?.phases || []).map(ph => ({ t: ph.name, s: "Methodology phase", k: ph.tasks.join(" "), run: go("methodology") })),
    { t: "Play the methodology game", s: "Fun", run: () => { go("methodology")(); $('[data-mt="game"]')?.click(); } },
    { t: "Process Lab: as-is vs to-be", s: "Interactive", run: () => { go("methodology")(); $('[data-mt="lab"]')?.click(); } },
    { t: "Education & certifications", s: "Section", run: go("education") },
    { t: "Open Terminal", s: "Fun", run: () => openTerm() },
    { t: "About this portfolio", s: "Info", run: () => openSpec() },
    { t: "Close all windows", s: "Action", run: () => closeAll() },
    ...P.experience.map((j, i) => ({ t: j.role, s: `Experience · ${j.company.split("·")[0].trim()}`, k: [j.summary, ...(j.points || []), ...(j.tags || [])].join(" "), run: () => {
      const li = $$("#timeline .job")[i]; if (!li) return;
      if (!li.classList.contains("open")) $(".exp", li)?.click();
      li.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    } })),
    ...groups.flatMap((g, gi) => g.items.map(s => ({ t: s, s: `Skill · ${g.group}`, run: () => { showGroup(gi); go("about")(); } }))),
    { t: "Switch light / dark", s: "Action", run: () => themeBtn.click() },
    { t: "Copy email address", s: "Action", run: () => copy(p.email, "Email copied") },
    { t: "Explore desktop mode", s: "Page", run: () => { location.href = "desktop.html"; } }
  ];
  let res = [], sel = 0;
  const drawPal = () => {
    const q = palIn.value.trim().toLowerCase();
    // titles first, then matches found inside descriptions
    res = q ? [...ITEMS.filter(i => (i.t + " " + i.s).toLowerCase().includes(q)), ...ITEMS.filter(i => !(i.t + " " + i.s).toLowerCase().includes(q) && (i.k || "").toLowerCase().includes(q))].slice(0, 12) : ITEMS.slice(0, 9); sel = 0;
    palList.innerHTML = res.length ? res.map((r, i) => `<li data-i="${i}" class="${i === 0 ? "sel" : ""}" role="option" aria-selected="${i === 0}"><span>${esc(r.t)}</span><small>${esc(r.s)}</small></li>`).join("") : `<li><small>No results</small></li>`;
  };
  const openPal = () => { pal.hidden = false; palIn.value = ""; drawPal(); setTimeout(() => palIn.focus(), 10); };
  const closePal = () => { pal.hidden = true; };
  const runPal = i => { const r = res[i]; if (!r) return; closePal(); r.run(); };
  $("#searchBtn").addEventListener("click", openPal);
  palIn.addEventListener("input", drawPal);
  palIn.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); if (!res.length) return;
      sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + res.length) % res.length;
      $$("li[data-i]", palList).forEach((li, k) => { li.classList.toggle("sel", k === sel); li.setAttribute("aria-selected", k === sel); if (k === sel) li.scrollIntoView({ block: "nearest" }); });
    } else if (e.key === "Enter") runPal(sel);
  });
  palList.addEventListener("click", e => { const li = e.target.closest("li[data-i]"); if (li) runPal(+li.dataset.i); });
  pal.addEventListener("pointerdown", e => { if (e.target === pal) closePal(); });
  document.addEventListener("keydown", e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? openPal() : closePal(); }
    else if (e.key === "`" && !typing) { e.preventDefault(); termWrap.hidden ? openTerm() : closeTerm(); }
    else if (e.key === "Escape") { closePal(); closeLightbox(); closeModal(); closeMenu(); closeTerm(); closeApps(); }
  });

  /* ---------------- reveal on scroll (only for things below the first screen) ---------------- */
  const revIO = new IntersectionObserver(es => es.forEach(en => {
    // reveal when visible, or when the visitor has already jumped past it
    if (!en.isIntersecting && en.boundingClientRect.top > 0) return;
    const el = en.target, sibs = [...el.parentElement.children].filter(x => x.classList.contains("reveal"));
    el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 70 + "ms";
    el.classList.remove("pre"); revIO.unobserve(el);
  }), { threshold: .12 });
  if (!reduced) $$(".reveal").forEach(el => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("pre"); revIO.observe(el); } });

  onScroll();
})();
