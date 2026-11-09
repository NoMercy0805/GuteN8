#!/usr/bin/env python3
"""Import verified original illustrations from the prepared GuteN8 ZIP.

Usage: python3 scripts/import_originalbilder.py /path/to/GuteN8_Originalbilder_App_optimiert.zip
"""
import json
import pathlib
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
ART = ROOT / "app/src/main/assets/art"
STORIES = ROOT / "app/src/main/assets/stories.json"
EXPECTED = {
    "berg", "fliegender-kuchen", "kuschelkissen", "luftballon",
    "riesenrad", "schatztruhe", "seifenkiste", "sternschnuppe",
    "verschwundene-kuerbisse",
}

def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 scripts/import_originalbilder.py <optimized-original-images.zip>")
    archive = pathlib.Path(sys.argv[1])
    with zipfile.ZipFile(archive) as z:
        found = {
            pathlib.PurePosixPath(name).stem: name
            for name in z.namelist()
            if name.startswith("app/src/main/assets/art/") and name.endswith(".webp")
        }
        if set(found) != EXPECTED:
            raise SystemExit(f"Unexpected image list: missing={EXPECTED - set(found)}, extra={set(found) - EXPECTED}")
        ART.mkdir(parents=True, exist_ok=True)
        for story_id, name in found.items():
            payload = z.read(name)
            if not payload.startswith(b"RIFF") or payload[8:12] != b"WEBP":
                raise SystemExit(f"Invalid WebP: {name}")
            (ART / f"{story_id}.webp").write_bytes(payload)
    stories = json.loads(STORIES.read_text(encoding="utf-8"))
    if len(stories) != 14 or len({story["id"] for story in stories}) != 14:
        raise SystemExit("Expected exactly 14 distinct original stories")
    by_id = {story["id"]: story for story in stories}
    imported = 0
    for story_id in EXPECTED:
        if story_id not in by_id:
            # 'berg' may not be part of the current 14-story lineup.
            if story_id == "berg":
                continue
            raise SystemExit(f"Missing story: {story_id}")
        by_id[story_id]["image"] = f"art/{story_id}.webp"
        imported += 1
        # Do not mark as verified: verify exact original image visually first.
        by_id[story_id]["originalImageVerified"] = False
    STORIES.write_text(json.dumps(stories, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(EXPECTED)} WebP files; linked {imported} to current stories.")
    if "berg" not in by_id:
        print("WARNING: berg.webp has no matching original story. Zauberpilz still needs its own illustration.")

if __name__ == "__main__":
    main()
