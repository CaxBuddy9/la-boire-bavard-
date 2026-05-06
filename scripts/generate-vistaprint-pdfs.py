"""Render each card (recto + 4 versos) to its own Vistaprint-ready PDF.

Output: D:\\la-boire-bavard\\vistaprint\\
  - recto.pdf          (front side)
  - verso-vert.pdf     (V1 Forest Green)
  - verso-bleu.pdf     (V2 Navy Blue)
  - verso-bordeaux.pdf (V3 Bordeaux)
  - verso-graphite.pdf (V4 Graphite)

Each PDF = 89x59mm = trim 85x55mm + 2mm bleed (Vistaprint EU standard).
"""
import subprocess
from pathlib import Path

ROOT = Path(r"D:\la-boire-bavard")
OUT = ROOT / "vistaprint"
OUT.mkdir(exist_ok=True)

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
URL = f"file:///{ROOT.as_posix()}/carte-de-visite.html"

cards = [
    ("recto", "recto"),
    ("v1", "verso-vert"),
    ("v2", "verso-bleu"),
    ("v3", "verso-bordeaux"),
    ("v4", "verso-graphite"),
]

for slug, filename in cards:
    out_pdf = OUT / f"{filename}.pdf"
    print(f"-> {out_pdf.name}")
    result = subprocess.run(
        [
            CHROME,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--hide-scrollbars",
            "--no-pdf-header-footer",
            f"--print-to-pdf={out_pdf}",
            "--virtual-time-budget=8000",
            f"{URL}?only={slug}",
        ],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if not out_pdf.exists() or out_pdf.stat().st_size < 10000:
        print(f"   FAILED ({result.stderr[:200] if result.stderr else 'unknown'})")
    else:
        print(f"   OK  {out_pdf.stat().st_size // 1024} KB")

print(f"\nDone. Files in: {OUT}")
