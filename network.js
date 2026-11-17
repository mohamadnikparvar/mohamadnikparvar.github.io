/* Connected-network background: drifting nodes that link up when close,
   and reach toward the pointer. Shared by the site (site.js) and Desktop mode (app.js). */
window.NetBG = function () {
  const LINK = 135, REACH = 190;
  let nodes = [], W = 0, H = 0, px = -1e4, py = -1e4, lastT = 0;
  addEventListener("pointermove", e => { px = e.clientX; py = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", () => { px = py = -1e4; });

  function resize(w, h) {
    const sx = W ? w / W : 1, sy = H ? h / H : 1;
    W = w; H = h;
    const n = Math.round(Math.min(95, Math.max(26, (w * h) / 15000)));
    nodes.forEach(p => { p.x *= sx; p.y *= sy; });
    while (nodes.length < n) {
      const a = Math.random() * Math.PI * 2, s = 0.12 + Math.random() * 0.22;
      nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: 1 + Math.random() * 1.3 });
    }
    nodes.length = n;
  }

  function draw(ctx, t, dark, still) {
    const dt = lastT && !still ? Math.min(t - lastT, 100) / 16.7 : 0; lastT = t;
    const rgb = dark ? "125,170,255" : "47,107,255";
    const lineA = dark ? 0.34 : 0.24, dotA = dark ? 0.7 : 0.5;
    for (const p of nodes) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); } else if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); } else if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); }
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${rgb},${(lineA * (1 - d / LINK)).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const d = Math.hypot(a.x - px, a.y - py);
      if (d < REACH) {
        ctx.strokeStyle = `rgba(${rgb},${(lineA * 1.5 * (1 - d / REACH)).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(px, py); ctx.stroke();
      }
    }
    ctx.fillStyle = `rgba(${rgb},${dotA})`;
    for (const p of nodes) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
  }

  return { resize, draw };
};
