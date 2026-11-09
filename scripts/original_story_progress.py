#!/usr/bin/env python3
"""Report verifiable completion of the fourteen original GuteN8 stories."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
stories = json.loads((root / "app/src/main/assets/stories.json").read_text(encoding="utf-8"))
assert len(stories) == 14 and len({s["id"] for s in stories}) == 14, "Expected 14 unique original stories"
text_done = image_done = 0
for s in stories:
    text = s.get("text", "")
    valid_text = bool(s.get("originalTextVerified")) and len(text.strip()) > 100 and "Originaltext wird noch" not in text
    image = s.get("image") or ""
    valid_image = bool(s.get("originalImageVerified")) and image.startswith("art/") and (root / "app/src/main/assets" / image).is_file()
    text_done += valid_text
    image_done += valid_image
    print(f"{s['id']}: text={'OK' if valid_text else 'OFFEN'}, bild={'OK' if valid_image else 'OFFEN'}")
done = text_done + image_done
print(f"FORTSCHRITT: {done}/28 = {done*100//28}% (Texte {text_done}/14, Bilder {image_done}/14)")
