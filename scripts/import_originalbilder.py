#!/usr/bin/env python3
"""Import seven matching original illustrations from a supplied GuteN8 ZIP.

Run: python3 scripts/import_originalbilder.py GuteN8_7_Originalbilder_importbereit.zip

This intentionally does not mark illustrations verified: image assets must be
checked visually against the original source before completing the audit.
"""
import hashlib
import json
import pathlib
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
ART = ROOT / "app/src/main/assets/art"
STORIES = ROOT / "app/src/main/assets/stories.json"
EXPECTED_SHA256 = {
    "fliegender-kuchen": "4b6f4734c464bd84b8540b8be6530c46f0e4a4e32eb00636816fd404e60d56a8",
    "luftballon": "f11193be9c0d5492489f744b9f0b300b136559e5a9c118f73eef55869157c5ab",
    "riesenrad": "240f5615906b22c4e0893959a81c9115d27d1e3158fa5f4e9e75c8275b5252a4",
    "schatztruhe": "eaa8f7c336472485a61ce9703084202ee962e0cd748f24b8756fb3bf230f5203",
    "seifenkiste": "faca82f80cff9918db3fd784f7492ff5db78fca64998b7e504b87de9e742ecba",
    "sternschnuppe": "06c3f991bbebaa015ef6f1c830085f936d0ad8be002a817ef7bd847a54c7ac1e",
    "verschwundene-kuerbisse": "c1fdaccfb087dc92f06a0262be289413e91b7592dab701bdf5465aec43855981",
}
EXPECTED = set(EXPECTED_SHA256)

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
            digest = hashlib.sha256(payload).hexdigest()
            if digest != EXPECTED_SHA256[story_id]:
                raise SystemExit(f"Original artwork checksum mismatch: {story_id}")
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
