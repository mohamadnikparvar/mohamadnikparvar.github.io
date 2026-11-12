# Mohamad Nikparvar — Portfolio

A static website: no server, database or build step. Upload this folder to any static host.

- **`index.html`** — the main site (scrolling page with menu bar and dock).
- **`desktop.html`** — Desktop mode (windows, dock, widgets). Same content, same features.
- **`404.html`** — shown for addresses that don't exist.

## Edit your content

Everything you write lives in **`content.js`**: profile, impact numbers, jobs, education, case studies,
methodology, research, services. Both modes read from it, so you only edit it once.

| To change | Edit |
|---|---|
| Text, projects, jobs, skills | `content.js` |
| Photo | replace `assets/photo.jpg` (square, face centered), then rebuild the sketch (below) |
| CV | edit `../resume/resume.html`, then rebuild (below) |
| Link-preview image | `../tools/share-card.html`, then rebuild (below) |
| WMS prototype | replace `prototypes/wms.html` |

## Rebuild scripts (in `../tools`, run from the folder that contains `portfolio`)

```bash
python3 tools/make_sketch.py      # photo.jpg -> assets/photo-sketch.png
sh tools/build_resume.sh          # resume PDFs; portfolio/cv.pdf has no phone number
sh tools/build_assets.sh          # share card + tab icons
```

## Publish

Upload **only this `portfolio` folder**. The folder above it holds private files
(certificate with your national ID, full thesis, working files).

After publishing, open `index.html` and `desktop.html` and replace `assets/share-card.png` in the
`og:image` line with the full address, for example
`https://YOUR-NAME.github.io/portfolio/assets/share-card.png`, so LinkedIn and Telegram show the preview.

Fonts are bundled in `assets/fonts`, so the site doesn't depend on Google Fonts.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000
