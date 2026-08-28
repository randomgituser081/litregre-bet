"""One-off: crop/trim official litre-images logos for litregre-bet/public/brand."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "litre-images"
OUT = Path(__file__).resolve().parents[1] / "public" / "brand"
NAVY = (10, 20, 51, 255)


def to_rgba(img: Image.Image) -> Image.Image:
    return img.convert("RGBA")


def remove_near_color(img: Image.Image, target: tuple[int, int, int], tol: int = 38) -> Image.Image:
    rgba = to_rgba(img)
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if abs(r - target[0]) <= tol and abs(g - target[1]) <= tol and abs(b - target[2]) <= tol:
                px[x, y] = (r, g, b, 0)
    return rgba


def trim(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    return img.crop(bbox)


def crop_mark(full: Image.Image) -> Image.Image:
    """Monogram only — left ~31% of trimmed horizontal lockup."""
    w, h = full.size
    cut = max(int(w * 0.31), 1)
    return full.crop((0, 0, cut, h))


def square_icon(mark: Image.Image, size: int = 512) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), NAVY)
    mw, mh = mark.size
    pad = int(size * 0.14)
    inner = size - pad * 2
    scale = min(inner / mw, inner / mh)
    nw, nh = int(mw * scale), int(mh * scale)
    resized = mark.resize((nw, nh), Image.Resampling.LANCZOS)
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    light_src = SRC / "LitreGre Prediction Upward Logo.png"
    dark_src = SRC / "photo_2026-08-27_10-02-19.jpg"

    light = trim(remove_near_color(Image.open(light_src), (255, 255, 255), tol=42))
    dark = trim(remove_near_color(Image.open(dark_src), (0, 0, 0), tol=28))

    mark = trim(crop_mark(light))

    light.save(OUT / "logo-light.png", optimize=True)
    dark.save(OUT / "logo-dark.png", optimize=True)
    mark.save(OUT / "mark.png", optimize=True)

    icon512 = square_icon(mark, 512)
    icon512.save(OUT / "icon-512.png", optimize=True)
    square_icon(mark, 180).save(OUT / "apple-touch-icon.png", optimize=True)

    # Next.js app icon
    app_icon = Path(__file__).resolve().parents[1] / "app" / "icon.png"
    icon512.save(app_icon, optimize=True)

    print("Wrote:", *[p.name for p in OUT.iterdir()], "app/icon.png")
    for name in ("logo-light.png", "logo-dark.png", "mark.png", "icon-512.png"):
        im = Image.open(OUT / name)
        print(name, im.size)


if __name__ == "__main__":
    main()
