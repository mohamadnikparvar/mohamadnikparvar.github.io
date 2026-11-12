/* Pencil-sketch effect, shared by the main site and desktop mode.
   makeSketch(src, size) turns a photo into graphite lines on transparent background.
   drawIn(canvas, sketch) animates the sketch being drawn with hatching strokes. */
(() => {
  "use strict";

  // three-pass box blur approximates a Gaussian blur
  function blur(src, w, h, r) {
    let a = Float32Array.from(src), b = new Float32Array(w * h);
    for (let pass = 0; pass < 3; pass++) {
      for (let y = 0; y < h; y++) { // horizontal
        let acc = 0; const row = y * w;
        for (let x = -r; x <= r; x++) acc += a[row + Math.min(w - 1, Math.max(0, x))];
        for (let x = 0; x < w; x++) {
          b[row + x] = acc / (2 * r + 1);
          acc += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
        }
      }
      for (let x = 0; x < w; x++) { // vertical
        let acc = 0;
        for (let y = -r; y <= r; y++) acc += b[Math.min(h - 1, Math.max(0, y)) * w + x];
        for (let y = 0; y < h; y++) {
          a[y * w + x] = acc / (2 * r + 1);
          acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
        }
      }
    }
    return a;
  }

  const cache = {};
  window.makeSketch = (src, size = 560, ink = [20, 24, 33]) => cache[src + size] || (cache[src + size] = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = c.height = size;
      const x = c.getContext("2d", { willReadFrequently: true });
      const s = Math.max(size / img.width, size / img.height), w = img.width * s, h = img.height * s;
      x.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      let d; try { d = x.getImageData(0, 0, size, size).data; } catch (e) { reject(e); return; } // blocked for cross-origin or file:// images
      const n = size * size;
      const gray = new Float32Array(n), inv = new Float32Array(n);
      for (let i = 0; i < n; i++) { const g = .299 * d[i * 4] + .587 * d[i * 4 + 1] + .114 * d[i * 4 + 2]; gray[i] = g; inv[i] = 255 - g; }
      const bl = blur(inv, size, size, Math.max(2, Math.round(size / 70)));
      const out = x.createImageData(size, size), o = out.data;
      for (let i = 0; i < n; i++) {
        // colour dodge: gray / (1 - blurred inverse) -> pencil lines
        let v = bl[i] >= 254 ? 255 : Math.min(255, gray[i] * 255 / (255 - bl[i]));
        let dark = Math.min(255, (255 - v) * 2.1);          // strengthen lines
        dark = dark < 14 ? 0 : dark;                          // clean paper
        const shade = Math.max(0, (150 - gray[i]) * .55);    // soft pencil shading in dark areas (suit, hair)
        dark = Math.min(255, dark + shade);
        // soft vignette so the busy background fades out around the face
        const px = i % size, py = (i / size) | 0, dx = px / size - .5, dy = py / size - .44;
        const fade = Math.min(1, Math.max(0, (.52 - Math.hypot(dx * 1.05, dy)) / .2));
        o[i * 4] = ink[0]; o[i * 4 + 1] = ink[1]; o[i * 4 + 2] = ink[2]; o[i * 4 + 3] = dark * fade;
      }
      x.putImageData(out, 0, 0);
      resolve(c);
    };
    img.onerror = reject;
    img.src = src;
  }));

  // Animate the sketch onto a visible canvas using pencil-like hatching strokes.
  window.drawIn = (canvas, sketch, ms = 2600, done) => {
    const ctx = canvas.getContext("2d"), size = canvas.width;
    ctx.clearRect(0, 0, size, size);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { ctx.drawImage(sketch, 0, 0, size, size); done?.(); return; }
    // strokes go onto an opaque mask, so overlapping strokes never darken the drawing
    const mask = document.createElement("canvas"); mask.width = mask.height = size;
    const m = mask.getContext("2d");
    m.lineCap = "round"; m.strokeStyle = "#000"; m.fillStyle = "rgba(0,0,0,.14)";
    const render = () => {
      ctx.globalCompositeOperation = "source-over"; ctx.clearRect(0, 0, size, size);
      ctx.drawImage(sketch, 0, 0, size, size);
      ctx.globalCompositeOperation = "destination-in"; ctx.drawImage(mask, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    };
    const t0 = performance.now();
    const angles = [-0.75, -0.62, 0.9];
    const tick = now => {
      const p = Math.min(1, (now - t0) / ms);
      const count = 18 + Math.round(70 * p);              // more strokes as it speeds up
      for (let i = 0; i < count; i++) {
        // start near the centre, spread outward over time (face first)
        const r = Math.sqrt(Math.random()) * size * (.2 + .45 * p), th = Math.random() * Math.PI * 2;
        const cx = size / 2 + Math.cos(th) * r, cy = size * .44 + Math.sin(th) * r;
        const a = angles[(Math.random() * angles.length) | 0] + (Math.random() - .5) * .3;
        const len = size * (.04 + Math.random() * .09);
        m.lineWidth = size * (.012 + Math.random() * .02);
        m.beginPath(); m.moveTo(cx, cy); m.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len); m.stroke();
      }
      render();
      if (p < 1) requestAnimationFrame(tick);
      else { // let the remaining gaps fill in softly
        let f = 0;
        const fill = () => { m.fillRect(0, 0, size, size); render(); if (++f < 22) requestAnimationFrame(fill); else { m.fillStyle = "#000"; m.fillRect(0, 0, size, size); render(); done?.(); } };
        fill();
      }
    };
    requestAnimationFrame(tick);
  };
})();
