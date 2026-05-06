"""Render a large PNG preview for each card (recto + 4 versos).

Output: D:\\la-boire-bavard\\vistaprint\\
  - preview-recto.png
  - preview-verso-vert.png
  - preview-verso-bleu.png
  - preview-verso-bordeaux.png
  - preview-verso-graphite.png

Each PNG ~ 850x550 px (10x trim size, hi-res mock-up for screens).
"""
import subprocess
from pathlib import Path

ROOT = Path(r"D:\la-boire-bavard")
OUT = ROOT / "vistaprint"
OUT.mkdir(exist_ok=True)

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
URL = f"file:///{ROOT.as_posix()}/carte-de-visite.html"

cards = [
    ("recto", "preview-recto"),
    ("v1", "preview-verso-vert"),
    ("v2", "preview-verso-bleu"),
    ("v3", "preview-verso-bordeaux"),
    ("v4", "preview-verso-graphite"),
]

# 212.5mm x 137.5mm at ~96dpi with workshop padding ~ 900x600 px card
# with headless --screenshot at --window-size (width, height), we crop around the .card-wrap
WINDOW_W, WINDOW_H = 1000, 700

for slug, filename in cards:
    out_png = OUT / f"{filename}.png"
    print(f"-> {out_png.name}")
    result = subprocess.run(
        [
            CHROME,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--hide-scrollbars",
            f"--window-size={WINDOW_W},{WINDOW_H}",
            f"--screenshot={out_png}",
            "--virtual-time-budget=8000",
            f"{URL}?only={slug}&preview=1",
        ],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if not out_png.exists() or out_png.stat().st_size < 5000:
        print(f"   FAILED ({result.stderr[:200] if result.stderr else 'unknown'})")
    else:
        print(f"   OK  {out_png.stat().st_size // 1024} KB")

print(f"\nDone. Files in: {OUT}")
