#!/usr/bin/env python3
"""Install the two reviewed GuteN8 Silvester/Ostern story illustrations from their ZIP."""
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile
import sys

ROOT = Path(__file__).resolve().parents[1]
ZIP = ROOT / "GuteN8_Silvester_Ostern_16zu9_FINAL.zip"
CHECKS = {
    "app/src/main/assets/art/silvester-wunschlicht.webp": "1c380eb633fe12b0bbb20a582c3961f3a8ead131a0b1d3a25ae6495324af8b52",
    "app/src/main/assets/art/ostern-regenbogen-ei.webp": "e62ce71295c95d645dbb63918d198b9815f4a3d48eed6e015e35dcb002da8f95",
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
