#!/usr/bin/env python3
"""Safely import the five newly illustrated GuteN8 stories from a ZIP."""
from pathlib import Path
from zipfile import ZipFile
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
STORY_FILE = ROOT / "app/src/main/assets/stories.json"
EXPECTED = {
    "blume": "b20067ae54a1aea36f488d460e099ab7e68791ad2a05c5002a27ae6d05b0f99c",
    "baumhaus": "915cd1df67920b8e220df642d2aa0fcb79d1651ddddc4a645130418a94ccba18",
    "regenbogenbruecke": "52ae5b0db02446ba8ab19e270a4fca5730155be64e1c2cbcd970a5ea79d5aa12",
    "decke": "25764fc23477ef6ffb7b466054767e3e00133bc7481276f0f2f6f5fbd0ecdcad",
    "picknick": "8c1ffdbf73e85b1a8be6671723738ff2a84863ffc5384031f1b68382305d857c"
}
PREFIX = "app/src/main/assets/art/"

def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: import_five_storybilder.py <zip-path>")
    stories = json.loads(STORY_FILE.read_text(encoding="utf-8"))
    story_ids = {s["id"] for s in stories}
    if len(story_ids) != len(stories) or not set(EXPECTED).issubset(story_ids):
        raise SystemExit("Missing or duplicate story IDs")
    with ZipFile(sys.argv[1]) as archive:
        expected_names = {f"{PREFIX}{id}.webp" for id in EXPECTED}
        found = set(archive.namelist())
        if found != expected_names:
            raise SystemExit(f"Archive contents do not match: {found ^ expected_names}")
        # Validate everything before writing anything.
        payloads = {}
        for id, digest in EXPECTED.items():
            data = archive.read(f"{PREFIX}{id}.webp")
            if not data.startswith(b"RIFF") or data[8:12] != b"WEBP":
                raise SystemExit(f"Invalid WebP: {id}")
            if hashlib.sha256(data).hexdigest() != digest:
                raise SystemExit(f"Checksum mismatch: {id}")
            payloads[id] = data
    for story in stories:
        if story["id"] in EXPECTED and story.get("image") != f"art/{story['id']}.webp":
            raise SystemExit(f"Unexpected story image mapping: {story['id']}")
    for id, data in payloads.items():
        dest = ROOT / PREFIX / f"{id}.webp"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        print(f"Imported {id} ({len(data)} bytes)")

if __name__ == "__main__":
    main()
