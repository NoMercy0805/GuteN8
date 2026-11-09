#!/usr/bin/env python3
"""Honest audit of the fourteen original GuteN8 stories.

A flag in stories.json alone is NOT proof of a verbatim source comparison.
Count an original as finished only with an archived, reproducible comparison.
"""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
assets = root / "app/src/main/assets"
stories = json.loads((assets / "stories.json").read_text(encoding="utf-8"))
proof_file = root / "original-source-evidence.json"
proof = json.loads(proof_file.read_text(encoding="utf-8")) if proof_file.exists() else {}
assert isinstance(stories, list) and len(stories) == 14, "Exactly 14 original stories required"
assert len({s["id"] for s in stories}) == 14, "Duplicate story IDs"
assert set(proof).issubset({s["id"] for s in stories}), "Evidence for unknown story"

done = 0
print("ORIGINALGESCHICHTEN – nachweisbare Einzelprüfung")
for story in stories:
    sid = story["id"]
    text = story.get("text", "")
    image = story.get("image", "")
    evidence = proof.get(sid, {})
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    # Evidence must identify a source and the exact text revision reviewed.
    text_ok = (
        bool(text.strip()) and "Originaltext wird noch" not in text
        and evidence.get("text_source") and evidence.get("text_sha256") == digest
        and evidence.get("word_for_word_reviewed") is True
    )
    image_path = assets / image if isinstance(image, str) and image.startswith("art/") else None
    image_ok = (
        image_path is not None and image_path.is_file()
        and evidence.get("image_source")
        and evidence.get("image_sha256") == hashlib.sha256(image_path.read_bytes()).hexdigest()
        and evidence.get("original_image_reviewed") is True
    )
    if text_ok and image_ok:
        done += 1
    text_state = "VERIFIZIERT" if text_ok else ("PLATZHALTER" if len(text.strip()) < 100 else "ABGLEICH OFFEN")
    image_state = "VERIFIZIERT" if image_ok else "ORIGINAL OFFEN"
    print(f"{sid}: Text {text_state}; Bild {image_state}")

print(f"FERTIGE GESCHICHTEN: {done}/14 = {done / 14 * 100:.1f}%")
print("Nur vollständig belegte Originaltext-Bild-Paare zählen als fertig.")
