#!/usr/bin/env python3
"""Verify and install 10 GuteN8 Advent illustrations from a user-uploaded ZIP."""
from pathlib import Path
from zipfile import ZipFile
from hashlib import sha256
import sys

ROOT = Path(__file__).resolve().parents[1]
PREFIX = 'app/src/main/assets/art/'
EXPECTED = {
    "advent-2026-01": "e31f0b512953e9cdd22b015f0c4833b725149a8d0e628d53d3bff0233ba4361a",
    "advent-2026-02": "39e1463c98b502255b5d177bb2c239ebd370fa766da36cf9dcb2b300f958cf61",
    "advent-2026-03": "70339a10ed1e088c9d3af80dc810ed049d91aca5f428234b5f7498cd499522a8",
    "advent-2026-04": "8c44fa89b59eb5e80c6865fa1d0130978bf9520815ebcd48d46afeb731bb0b18",
    "advent-2026-05": "f2ef679d0cb0559b182f6ae564296cdac2a63300c5d1a902f6b1172cbf21d4ea",
    "advent-2026-06": "9bbaee87904d3ca08f08d8fc51d52b85f451b29cc64faa4c858ee01b3ec85be8",
    "advent-2026-07": "35ff0fca4d3ec4c622fab203b78d8af290e5c947e0b6cca6e43b726a6f378870",
    "advent-2026-08": "797712405423317ed79d6bcee4c7a77508a10b7e4b50e0580023562f257b889c",
    "advent-2026-09": "7f77619eb1fb7bb5357929f76457fdb2de29bca9dea6a0adb38111e2864d782e",
    "advent-2026-10": "9a02576eec9c175d1ad12326b706a164d91cabf3f13ab5393284e61dc0ec6341"
}

def main():
    if len(sys.argv) != 2:
        raise SystemExit('Usage: import_advent_first10.py <zip>')
    with ZipFile(sys.argv[1]) as archive:
        wanted = {f'{PREFIX}{id}.webp' for id in EXPECTED}
        found = set(archive.namelist())
        if found != wanted:
            raise SystemExit(f'Unexpected image paths: {found ^ wanted}')
        images = {}
        for id, expected in EXPECTED.items():
            data = archive.read(f'{PREFIX}{id}.webp')
            if not (data[:4] == b'RIFF' and data[8:12] == b'WEBP'):
                raise SystemExit(f'Invalid WebP: {id}')
            if sha256(data).hexdigest() != expected:
                raise SystemExit(f'Incorrect image checksum: {id}')
            images[id] = data
    for id, data in images.items():
        p = ROOT / PREFIX / f'{id}.webp'
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data)
        print(f'Imported Advent illustration: {id} ({len(data)} bytes)')

if __name__ == '__main__':
    main()
