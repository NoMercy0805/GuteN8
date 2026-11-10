#!/usr/bin/env python3
"""Install the two reviewed GuteN8 Silvester/Ostern story illustrations from their ZIP."""
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile
import sys

ROOT = Path(__file__).resolve().parents[1]
ZIP = ROOT / "GuteN8_Silvester_Ostern_Bilder.zip"
CHECKS = {
    "app/src/main/assets/art/silvester-wunschlicht.webp": "9c5dbefc1c4fa0f4688999db791b3d64f8b7808adf59d0621e6b4051ece3e73b",
    "app/src/main/assets/art/ostern-regenbogen-ei.webp": "7bc6b0aa1d3d935bf6b42d18a918f7eb36ec8a67d91456250c865122ac1fec6d",
}

def main():
    if not ZIP.is_file():
        print("Seasonal illustrations ZIP not uploaded; keeping fallback.")
        return
    with ZipFile(ZIP) as z:
        if set(z.namelist()) != set(CHECKS):
            raise SystemExit("Unexpected entries in seasonal ZIP")
        if z.testzip() is not None:
            raise SystemExit("Corrupt seasonal ZIP")
        checked = {}
        for path, expected in CHECKS.items():
            content = z.read(path)
            if content[:4] != b"RIFF" or content[8:12] != b"WEBP":
                raise SystemExit("Not WebP: "+path)
            if sha256(content).hexdigest() != expected:
                raise SystemExit("Image checksum mismatch: "+path)
            checked[path] = content
    for path, content in checked.items():
        target = ROOT / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
        print("Imported", path)

if __name__ == "__main__":
    main()
