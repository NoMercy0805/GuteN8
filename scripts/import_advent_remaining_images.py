#!/usr/bin/env python3
"""Install the two later GuteN8 seasonal image ZIPs from the repository root.

Only explicitly named 1600x900 story WebP assets are accepted.
"""
from pathlib import Path
from zipfile import ZipFile
import sys

ROOT = Path(__file__).resolve().parents[1]
PREFIX = "app/src/main/assets/art/"
PACKS = {
    "GuteN8_Advent_11_bis_20_GEPRUEFT.zip": [
        f"advent-2026-{i:02d}" for i in range(11, 21)
    ],
    "GuteN8_Advent_21_bis_26_Sondergeschichten_GEPRUEFT.zip": [
        *[f"advent-2026-{i:02d}" for i in range(21, 27)],
        "st-martin-2026", "erster-advent-2026",
    ],
}

def import_pack(filename):
    source = ROOT / filename
    if not source.exists():
        print(f"Not uploaded: {filename}")
        return
    with ZipFile(source) as archive:
        wanted = {PREFIX + identifier + ".webp" for identifier in PACKS[filename]}
        present = set(archive.namelist())
        if present != wanted:
            raise SystemExit(f"Unexpected contents in {filename}: {present ^ wanted}")
        if archive.testzip() is not None:
            raise SystemExit(f"Corrupt archive: {filename}")
        verified = {}
        for path in sorted(wanted):
            data = archive.read(path)
            if len(data) < 100000 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
                raise SystemExit(f"Invalid image in archive: {path}")
            verified[path] = data
    for path, data in verified.items():
        target = ROOT / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        print(f"Imported {path} ({len(data)} bytes)")

if __name__ == "__main__":
    for filename in PACKS:
        import_pack(filename)
