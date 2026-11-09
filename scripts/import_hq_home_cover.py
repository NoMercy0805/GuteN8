#!/usr/bin/env python3
"""Replace the blurry 384x663 embedded home cover with the original higher-resolution artwork."""
from pathlib import Path
from hashlib import sha256
from zipfile import ZipFile
from base64 import b64encode
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE = "app/src/main/assets/art/reference-home-hq.webp"
TARGET = "app/src/main/assets/art/reference-home.svg"
EXPECTED_SHA256 = "db73019d4b12811170ddc2eb1bf0d3d6de3e827e248c22331f6318ff12fb54f4"

def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: import_hq_home_cover.py <GuteN8_Startbild_Hochaufloesend.zip>")
    with ZipFile(sys.argv[1]) as archive:
        if set(archive.namelist()) != {SOURCE}:
            raise SystemExit("Incorrect ZIP contents for high-resolution home cover")
        data = archive.read(SOURCE)
    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise SystemExit("Not a WebP file")
    if sha256(data).hexdigest() != EXPECTED_SHA256:
        raise SystemExit("High-resolution cover checksum mismatch")
    highres = ROOT / SOURCE
    highres.parent.mkdir(parents=True, exist_ok=True)
    highres.write_bytes(data)
    # Retain the original aspect-ratio / SVG viewBox to avoid changing centering,
    # blurred side panels, masking, or the existing Android WebView layout.
    encoded = b64encode(data).decode("ascii")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 663" '
        'preserveAspectRatio="none">'
        '<image width="384" height="663" href="data:image/webp;base64,'
        + encoded + '"/></svg>'
    )
    (ROOT / TARGET).write_text(svg, encoding="utf-8")
    print("Home cover upgraded from 384x663 to high-resolution 805x1086 source")

if __name__ == "__main__":
    main()
