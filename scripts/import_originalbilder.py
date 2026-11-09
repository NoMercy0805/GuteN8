#!/usr/bin/env python3
"""Import the seven matching illustrations from the prepared GuteN8 archive.

Run: python3 scripts/import_originalbilder.py GuteN8_6_passende_Originalbilder.zip
"""
import json
import pathlib
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
ART = ROOT / "app/src/main/assets/art"
STORIES = ROOT / "app/src/main/assets/stories.json"
EXPECTED = {
    "fliegender-kuchen", "luftballon", "riesenrad", "schatztruhe",
    "seifenkiste", "sternschnuppe", "verschwundene-kuerbisse",
}

def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 scripts/import_originalbilder.py <seven-images.zip>")
    with zipfile.ZipFile(sys.argv[1]) as archive:
        found = {
            pathlib.PurePosixPath(name).stem: name
            for name in archive.namelist()
            if name.startswith("app/src/main/assets/art/") and name.endswith(".webp")
        }
        if set(found) != EXPECTED:
            raise SystemExit(f"Image mismatch: missing={EXPECTED - set(found)}, extra={set(found) - EXPECTED}")
        stories = json.loads(STORIES.read_text(encoding="utf-8"))
        by_id = {story["id"]: story for story in stories}
        if len(stories) != 14 or len(by_id) != 14 or not EXPECTED <= set(by_id):
            raise SystemExit("Expected exactly 14 distinct original stories including all image IDs")
        payloads = {}
        for story_id, name in found.items():
            payload = archive.read(name)
            if not payload.startswith(b"RIFF") or payload[8:12] != b"WEBP":
                raise SystemExit(f"Invalid WebP: {name}")
            payloads[story_id] = payload
    ART.mkdir(parents=True, exist_ok=True)
    for story_id, payload in payloads.items():
        (ART / f"{story_id}.webp").write_bytes(payload)
        by_id[story_id]["image"] = f"art/{story_id}.webp"
        by_id[story_id]["originalImageVerified"] = False
    STORIES.write_text(json.dumps(stories, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported and linked {len(payloads)} images. Original-image verification still required.")

if __name__ == "__main__":
    main()
