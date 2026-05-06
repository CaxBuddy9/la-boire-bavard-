"""Strip black + white backgrounds from the logo and save as transparent PNG."""
from PIL import Image

src = r"D:\la-boire-bavard\LOGO LA BOIRE BAVARD OFFICIEL.jpg"
dst = r"D:\la-boire-bavard\public\logo-lbba-clean.png"

img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size

BLACK_MAX = 35     # a pixel is "black" if all channels <= this
WHITE_MIN = 225    # a pixel is "white" if all channels >= this
FADE_BAND = 55     # pixels near black fade gradually (antialiasing pass)

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        m = max(r, g, b)

        if r <= BLACK_MAX and g <= BLACK_MAX and b <= BLACK_MAX:
            pixels[x, y] = (0, 0, 0, 0)
        elif r >= WHITE_MIN and g >= WHITE_MIN and b >= WHITE_MIN:
            pixels[x, y] = (0, 0, 0, 0)
        elif m < BLACK_MAX + FADE_BAND:
            # Edge feather: pixels near black get partial transparency so edges stay smooth
            ratio = (m - BLACK_MAX) / FADE_BAND
            ratio = max(0.0, min(1.0, ratio))
            pixels[x, y] = (r, g, b, int(255 * ratio))

img.save(dst, "PNG")
print(f"OK -> {dst}  ({w}x{h})")
