#!/usr/bin/env python3
"""Generate a gallery overview (CSV mapping + PDF contact sheet) for Anke.

The gallery order is the single source of truth in ``src/images.js``. This script
parses that file (no hand-maintained list) and emits two files into ``public/``:

  - galerie-mapping.csv     position; aktuelle_position_neu; dateiname; status
  - galerie-uebersicht.pdf  A4 contact sheet: thumbnail + original pos + current pos + filename

Numbering follows the ORIGINAL order (index2.html) as the primary position — that is the
order Anke's feedback refers to. The curated live position (index.html) is shown only as a
secondary "(neu N)" annotation; "(entfernt)" marks the photo dropped from the live site.
  - primary   = legacy/original order (index2.html: _KWF* then VS-Tannheim*, natural sort, all 80)
  - secondary = curated live order (index.html, the ``order`` array; _KWF2044 dropped)

Run after changing the order in src/images.js:

    python3 scripts/galerie-uebersicht.py

Requires Pillow (already a dev dependency-free system package here).
"""
import os, re, csv, glob
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "src/assets/images")
OUT_DIR = os.path.join(ROOT, "public")
os.makedirs(OUT_DIR, exist_ok=True)

# --- parse images.js for the curated order array and the dropped set ---
js = open(os.path.join(ROOT, "src/images.js")).read()
order_block = re.search(r"const order = \[(.*?)\]\s*\nconst rank", js, re.S).group(1)
order = re.findall(r"'([^']+\.jpg)'", order_block)
dropped_block = re.search(r"DROPPED_FROM_NEW = new Set\(\[(.*?)\]\)", js, re.S).group(1)
dropped = set(re.findall(r"'([^']+\.jpg)'", dropped_block))

files = sorted(os.path.basename(p) for p in glob.glob(os.path.join(IMG_DIR, "*.jpg")))

def natkey(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]

rank = {n: i for i, n in enumerate(order)}
def rankof(n): return rank.get(n, 10**9)

# new live site order (curated, dropped removed)
new_order = sorted((f for f in files if f not in dropped),
                   key=lambda n: (rankof(n), natkey(n)))
new_pos = {n: i + 1 for i, n in enumerate(new_order)}

# legacy / original order: _KWF* natural, then VS-Tannheim* natural, nothing dropped
legacy = sorted((f for f in files if f.startswith("_KWF")), key=natkey) + \
         sorted((f for f in files if f.startswith("VS-Tannheim")), key=natkey)
legacy_pos = {n: i + 1 for i, n in enumerate(legacy)}

# --- CSV mapping ---
csv_path = os.path.join(OUT_DIR, "galerie-mapping.csv")
with open(csv_path, "w", newline="") as fh:
    w = csv.writer(fh, delimiter=";")
    w.writerow(["position", "aktuelle_position_neu", "dateiname", "status"])
    for n in sorted(files, key=lambda n: legacy_pos.get(n, 10**9)):
        ap = new_pos.get(n)
        w.writerow([legacy_pos.get(n, ""), ap if ap else "", n,
                    "live" if n in new_pos else "nicht auf Live-Seite (entfernt)"])
print("CSV:", csv_path)

# --- thumbnails (in memory) ---
THUMB = 360
def load_thumb(n):
    im = Image.open(os.path.join(IMG_DIR, n)).convert("RGB")
    im.thumbnail((THUMB, THUMB))
    return im

def font(sz):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()
F_POS, F_NAME, F_HEAD = font(26), font(18), font(34)

# --- PDF contact sheet, ordered by current gallery position ---
PW, PH = 1240, 1754           # A4 @ 150 dpi
MARGIN, HEAD_H, COLS, ROWS = 40, 70, 4, 5
cell_w = (PW - 2 * MARGIN) // COLS
cell_h = (PH - 2 * MARGIN - HEAD_H) // ROWS
per_page = COLS * ROWS

ordered = sorted(files, key=lambda n: legacy_pos.get(n, 10**9))
total_pages = (len(ordered) + per_page - 1) // per_page
pages = []
for pi in range(total_pages):
    page = Image.new("RGB", (PW, PH), "white")
    d = ImageDraw.Draw(page)
    d.text((MARGIN, 24), f"Haus Tannheim – Galerie-Übersicht   (Seite {pi+1}/{total_pages})",
           font=F_HEAD, fill="black")
    d.text((MARGIN, 68),
           "Pos = ursprüngliche Reihenfolge (index2.html) · (neu N) = aktuelle Live-Galerie · (entfernt) = nicht mehr live",
           font=F_NAME, fill=(90, 90, 90))
    for idx, n in enumerate(ordered[pi*per_page:(pi+1)*per_page]):
        r, c = divmod(idx, COLS)
        x = MARGIN + c * cell_w
        y = MARGIN + HEAD_H + r * cell_h
        th = load_thumb(n)
        ratio = min((cell_w - 20) / th.width, (cell_h - 64) / th.height)
        th = th.resize((int(th.width * ratio), int(th.height * ratio)))
        page.paste(th, (x + (cell_w - 20 - th.width) // 2 + 10, y))
        ap = new_pos.get(n)
        label = f"Pos {legacy_pos.get(n)}"
        label += f"  (neu {ap})" if ap else "  (entfernt)"
        d.text((x + 10, y + th.height + 4), label, font=F_POS,
               fill="black" if ap else (180, 0, 0))
        d.text((x + 10, y + th.height + 34), n, font=F_NAME, fill=(70, 70, 70))
    pages.append(page)

pdf_path = os.path.join(OUT_DIR, "galerie-uebersicht.pdf")
pages[0].save(pdf_path, "PDF", resolution=150, save_all=True, append_images=pages[1:])
print("PDF:", pdf_path, "Seiten:", len(pages))
print(f"Bilder live: {len(new_order)} | dropped: {sorted(dropped)} | gesamt: {len(files)}")
