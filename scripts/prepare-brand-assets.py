"""Crop/trim official litre-images logos + light-on-dark variants for navy UI."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "litre-images"
OUT = Path(__file__).resolve().parents[1] / "public" / "brand"
IDENTITY = SRC / "LitreGre Prediction Band Identity Concept.png"
NAVY = (10, 20, 51, 255)
LIGHT_INK = (245, 247, 250)


def to_rgba(img: Image.Image) -> Image.Image:
    return img.convert("RGBA")


def remove_near_color(img: Image.Image, target: tuple[int, int, int], tol: int = 38) -> Image.Image:
    rgba = to_rgba(img)
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            if abs(r - target[0]) <= tol and abs(g - target[1]) <= tol and abs(b - target[2]) <= tol:
                px[x, y] = (r, g, b, 0)
    return rgba


def trim(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    return img.crop(bbox)


def is_green_accent(r: int, g: int, b: int) -> bool:
    return g > 70 and g >= r and g > b - 15


def to_light_ink(img: Image.Image) -> Image.Image:
    """Navy/black wordmark + L → brand light ink; keep green accents."""
    rgba = to_rgba(img)
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 12:
                continue
            if is_green_accent(r, g, b):
                continue
            if max(r, g, b) < 145:
                px[x, y] = (*LIGHT_INK, a)
    return rgba


def crop_mark(full: Image.Image, ratio: float = 0.31) -> Image.Image:
    w, h = full.size
    cut = max(int(w * ratio), 1)
    return full.crop((0, 0, cut, h))


def crop_identity_mark() -> Image.Image | None:
    if not IDENTITY.exists():
        return None
    im = Image.open(IDENTITY)
    cropped = im.crop((20, 95, 580, 265))
    # Identity crop sits on navy — knock out background for transparent mark-light fallback
    return trim(remove_near_color(cropped, NAVY[:3], tol=35))


def square_icon(mark: Image.Image, size: int = 512) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), NAVY)
    src = to_rgba(mark)
    mw, mh = src.size
    pad = int(size * 0.14)
    inner = size - pad * 2
    scale = min(inner / mw, inner / mh)
    nw, nh = int(mw * scale), int(mh * scale)
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    light_src = SRC / "LitreGre Prediction Upward Logo.png"
    light = trim(remove_near_color(Image.open(light_src), (255, 255, 255), tol=42))
    dark = trim(to_light_ink(light))

    identity_mark = crop_identity_mark()
    mark = trim(crop_mark(light))
    mark_light = trim(to_light_ink(crop_mark(light)))
    if identity_mark is not None:
        # Prefer identity-sheet white L when background removal is clean
        mark_light = identity_mark

    light.save(OUT / "logo-light.png", optimize=True)
    dark.save(OUT / "logo-dark.png", optimize=True)
    mark.save(OUT / "mark.png", optimize=True)
    mark_light.save(OUT / "mark-light.png", optimize=True)

    icon512 = square_icon(mark_light, 512)
    icon512.save(OUT / "icon-512.png", optimize=True)
    square_icon(mark_light, 180).save(OUT / "apple-touch-icon.png", optimize=True)

    app_icon = Path(__file__).resolve().parents[1] / "app" / "icon.png"
    icon512.save(app_icon, optimize=True)

    print("Wrote brand assets + light-on-dark variants")
    for name in ("logo-light.png", "logo-dark.png", "mark.png", "mark-light.png", "icon-512.png"):
        im = Image.open(OUT / name)
        print(name, im.size)


if __name__ == "__main__":
    main()
