#!/usr/bin/env python3
"""Reproducible audit for the fourteen original GuteN8 stories.

Never equate an existing story, a reviewed text, and a reviewed illustration.
The text hash ties a review to exactly one saved story revision.
"""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
assets = root / "app/src/main/assets"
stories = json.loads((assets / "stories.json").read_text(encoding="utf-8"))
proof_file = root / "original-source-evidence.json"
proof = json.loads(proof_file.read_text(encoding="utf-8")) if proof_file.exists() else {}

assert isinstance(stories, list) and len(stories) == 14, "Expected 14 original stories"
ids = [story["id"] for story in stories]
assert len(set(ids)) == 14, "Duplicate original story IDs"
assert set(proof).issubset(ids), "Evidence references a missing story"

present = verified_texts = linked_images = verified_images = finished = 0
problems = []
print("GuteN8 – überprüfbarer Stand der 14 Originalgeschichten")
for story in stories:
    sid = story["id"]
    content = story.get("text", "")
    evidence = proof.get(sid, {})
    exists = len(content.strip()) > 500 and "Originaltext wird noch" not in content
    digest = hashlib.sha256(content.encode("utf-8")).hexdigest()
    text_ok = bool(
        exists
        and evidence.get("text_source")
        and evidence.get("text_sha256") == digest
        and evidence.get("word_for_word_reviewed") is True
    )
    image = story.get("image") or ""
    image_path = assets / image if isinstance(image, str) and image.startswith("art/") else None
    linked = bool(image_path is not None and image_path.is_file())
    image_ok = bool(
        linked
        and evidence.get("image_source")
        and evidence.get("image_sha256") == hashlib.sha256(image_path.read_bytes()).hexdigest()
        and evidence.get("original_image_reviewed") is True
    )
    if story.get("originalTextVerified") is True and not text_ok:
        problems.append(f"{sid}: text flag true without matching proof")
    if story.get("originalImageVerified") is True and not image_ok:
        problems.append(f"{sid}: image flag true without matching proof")
    present += bool(exists)
    verified_texts += bool(text_ok)
    linked_images += bool(linked)
    verified_images += bool(image_ok)
    finished += bool(text_ok and image_ok)
    state = "OK" if text_ok else ("VORHANDEN, ABGLEICH OFFEN" if exists else "FEHLT")
    visual = "ORIGINAL GEPRÜFT" if image_ok else ("DATEI VORHANDEN, UNGEPRÜFT" if linked else "NICHT EINGEBUNDEN")
    print(f"{sid}: Text {state}; Bild {visual}")

print()
print(f"Text vorhanden: {present}/14")
print(f"Text nachweislich geprüft: {verified_texts}/14")
print(f"Bilddatei eingebunden: {linked_images}/14")
print(f"Originalbild nachweislich geprüft: {verified_images}/14")
print(f"Komplett abgeschlossen: {finished}/14 = {finished / 14 * 100:.1f}%")
if problems:
    raise AssertionError("Inkonsistente Prüfkennzeichen:\n" + "\n".join(problems))
