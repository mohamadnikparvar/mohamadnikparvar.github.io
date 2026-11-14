/* Interactive scope mind map, shared by the main site and desktop mode.
   renderMindmap(host, data) where data = { root, branches: [{ name, children?: [...], items?: [...] }] } */
(() => {
  "use strict";
  const css = `
  .mm{display:grid;gap:12px}
  .mm-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px}
  .mm-root{font-weight:700;padding:7px 14px;border-radius:999px;color:#fff;background:linear-gradient(140deg,var(--accent),var(--lapis))}
  .mm-total{font-size:13px;color:var(--muted)}
  .mm-actions{margin-left:auto;display:flex;gap:6px}
  .mm-actions button{font:inherit;font-size:12.5px;font-weight:600;padding:6px 12px;border-radius:999px;cursor:pointer;color:var(--ink);background:var(--soft);border:1px solid var(--hair)}
  .mm-tree{display:grid;gap:8px;position:relative;padding-left:14px;border-left:2px solid var(--hair)}
  .mm-node>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;font-weight:600;
    background:var(--card,var(--glass));border:1px solid var(--hair);transition:border-color .2s,background .2s}
  .mm-node>summary::-webkit-details-marker{display:none}
  .mm-node>summary:hover{border-color:var(--accent)}
  .mm-node[open]>summary{border-color:var(--accent);background:var(--chip)}
  .mm-dot{flex:none;width:10px;height:10px;border-radius:50%;background:var(--accent);position:relative}
  .mm-node.d1>summary .mm-dot::before{content:"";position:absolute;right:100%;top:50%;width:18px;height:2px;margin-right:12px;background:var(--hair)}
  .mm-node.d2>summary{font-weight:500;padding:7px 11px}
  .mm-node.d2>summary .mm-dot{width:8px;height:8px;background:var(--accent-2,var(--accent))}
  .mm-name{flex:1}
  .mm-n{font-size:12px;font-weight:700;color:var(--muted);font-variant-numeric:tabular-nums}
  .mm-node>summary::after{content:"";width:8px;height:8px;border-right:2px solid var(--muted);border-bottom:2px solid var(--muted);transform:rotate(-45deg);transition:transform .25s;margin-left:2px}
  .mm-node[open]>summary::after{transform:rotate(45deg)}
  .mm-kids{display:grid;gap:6px;padding:8px 0 4px 18px;margin-left:5px;border-left:2px solid var(--hair);animation:mmIn .3s ease}
  .mm-items{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
  .mm-items li{font-size:12.5px;padding:5px 10px;border-radius:999px;background:var(--soft);border:1px solid var(--hair);color:var(--ink-2)}
  @keyframes mmIn{from{opacity:0;transform:translateY(-4px)}}
  @media (prefers-reduced-motion:reduce){.mm-kids{animation:none}}`;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const count = b => (b.items?.length || 0) + (b.children || []).reduce((n, c) => n + count(c), 0);

  window.renderMindmap = (host, mm) => {
    if (!document.getElementById("mm-style")) {
      const st = document.createElement("style"); st.id = "mm-style"; st.textContent = css; document.head.append(st);
    }
    const node = (b, depth, open) => `<details class="mm-node d${depth}"${open ? " open" : ""}>
      <summary><span class="mm-dot" aria-hidden="true"></span><span class="mm-name">${esc(b.name)}</span><span class="mm-n">${count(b)}</span></summary>
      <div class="mm-kids">${(b.children || []).map(c => node(c, depth + 1, false)).join("")}
        ${b.items?.length ? `<ul class="mm-items">${b.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}</div></details>`;
    const total = mm.branches.reduce((n, b) => n + count(b), 0);
    host.innerHTML = `<div class="mm">
      <div class="mm-bar"><span class="mm-root">${esc(mm.root)}</span><span class="mm-total">${mm.branches.length} areas · ${total} features</span>
        <span class="mm-actions"><button type="button" data-mm="open">Expand all</button><button type="button" data-mm="close">Collapse all</button></span></div>
      <div class="mm-tree">${mm.branches.map((b, i) => node(b, 1, i === 0)).join("")}</div>
    </div>`;
    host.addEventListener("click", e => {
      const b = e.target.closest("[data-mm]"); if (!b) return;
      host.querySelectorAll("details").forEach(d => { d.open = b.dataset.mm === "open"; });
    });
  };
})();
