#!/usr/bin/env python3
"""Check the narrative continuity of three restored screenshot originals.

This test does NOT certify a character-for-character transcription. It catches
accidental substitutions, omissions and story mixing while the exact original
text comparison is still pending.
"""
import json
from pathlib import Path

stories = {
    x["id"]: x
    for x in json.loads(
        (Path(__file__).resolve().parents[1] / "app/src/main/assets/stories.json")
        .read_text(encoding="utf-8")
    )
}
scenes = {
    "seifenkiste": (
        "Eines schönen Morgens hatte Hoppel der Hase",
        "eine wunderschöne rote Seifenkiste",
        "Bobby setzte sich als Erster hinein.",
        "Krümel ans Steuer",
        "Doch Krümel erwischte aus Versehen die Hupe.",
        "PLUUUUMPS!",
        "Nur Hoppels Ohren und Krümels kleine Nase",
        "landete direkt auf Bobbys Kopf",
        "Honigbecherhalter",
        "Gute Nacht, Bobby, Hoppel und Krümel.",
    ),
    "sternschnuppe": (
        "Eines Abends hatte Hoppel der Hase",
        "ein gemütliches Zelt",
        "SCHAAAAUT MAL! EINE STERNSCHNUPPE!",
        "einen riesigen Berg Gurken",
        "Schokoladenkekse regnet",
        "PLOCK!",
        "ein kleines Eichhörnchen",
        "fünf Kekse auf Bobbys Bauch",
        "Dein knurrender Bauch",
        "Gute Nacht, Bobby, Hoppel und Krümel.",
    ),
    "verschwundene-kuerbisse": (
        "Eines schönen Herbstmorgens",
        "Heute wollen wir Kürbisse schnitzen!",
        "Alle Kürbisse waren verschwunden!",
        "eine lange Spur im Matsch",
        "RUMPEL! POLTER! KRAWUMMS!",
        "Ein kleines Eichhörnchen",
        "Halloween-Überraschung",
        "einen großen Heuhaufen",
        "mit langen Hasenohren",
        "Träumt von lustigen Kürbissen",
    ),
}

for story_id, checkpoints in scenes.items():
    text = stories[story_id]["text"]
    positions = [text.find(checkpoint) for checkpoint in checkpoints]
    assert all(p >= 0 for p in positions), (story_id, [
        term for term, pos in zip(checkpoints, positions) if pos < 0
    ])
    assert positions == sorted(positions), (
        story_id, "Scenes out of sequence"
    )
    assert len(text) > 1500, (story_id, "Story unexpectedly truncated")
    print(f"{story_id}: {len(checkpoints)} expected scenes in order")

print("3/3 stories structurally complete; exact screenshot transcription unverified.")
