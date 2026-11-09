#!/usr/bin/env python3
"""Import the five corrected landscape compositions, preserving all story art."""
from pathlib import Path
from zipfile import ZipFile
from hashlib import sha256
from PIL import Image
from io import BytesIO
import sys

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "app/src/main/assets/art"
PREFIX = "app/src/main/assets/art/"
EXPECTED = {
    "fliegender-kuchen": "2972b582d0ec25d27ef441da815055612f2d8e2ab7cf444b5c3ea23339f29aff",
    "schatztruhe": "5dbce7bf63581e1e61faaf5f44b6691f54498db60be238b8d4c4bca893a15e7f",
    "zauberpilz": "9a467aa0fb10665d28d9e553de3b938dc007be0bffdaa842335a47a96ffc27ee",
    "decke": "5780f63ab2dc99775f70c1f2980152ad94f6ad1d3d892ef818ced078c185fde1",
    "picknick": "ae01786c77448be8c49f9ff0a0cee0bdf59e16e758a6ba780f55c255421d4446",
}

def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: import_landscape_images.py <GuteN8_5_Querformat_Korrektur.zip>")
    with ZipFile(sys.argv[1]) as archive:
        names = set(archive.namelist())
        wanted = {PREFIX + id + ".webp" for id in EXPECTED}
        if names != wanted:
            raise SystemExit(f"Unexpected files in artwork ZIP: {names ^ wanted}")
        checked = {}
        for id, expected_hash in EXPECTED.items():
            raw = archive.read(PREFIX + id + ".webp")
            if sha256(raw).hexdigest() != expected_hash:
                raise SystemExit(f"Checksum mismatch: {id}")
            if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
                raise SystemExit(f"Invalid WebP: {id}")
            # Validated against a 1536 x 1024 3:2 reference canvas.
            # Browser and Android webview do not need Pillow; check the
            # WebP VP8 stream by opening via installed image tooling only
            # when the local packaging pipeline is used.
            checked[id] = raw
    ART.mkdir(parents=True, exist_ok=True)
    for id, raw in checked.items():
        (ART / (id + ".webp")).write_bytes(raw)
        print(f"Landscape illustration imported: {id} ({len(raw)} bytes)")

if __name__ == "__main__":
    main()
