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
    "advent-2026-02": "78a5002b83ac99ac51228671cda5a950b71b3007211ec96a46a2ca6f8d06f3b4",
    "advent-2026-03": "8e6ab42bbffa311d52316064eb205c9efcd6f47e79f067967a24fb85f010b3ac",
    "advent-2026-04": "3dcae9de0a1be2adefb745e39d93063a795f3d0678ab8d41b353ab14b296010f",
    "advent-2026-05": "f2ef679d0cb0559b182f6ae564296cdac2a63300c5d1a902f6b1172cbf21d4ea",
    "advent-2026-06": "9bbaee87904d3ca08f08d8fc51d52b85f451b29cc64faa4c858ee01b3ec85be8",
    "advent-2026-07": "65558acb649da7325bdeb775472c2589e6672bfc4e9cd4a0793f798d807d4030",
    "advent-2026-08": "285ef4990cd9e55b8e2b2530044c4dc750f2b278a6a45873114b1006e3906c27",
    "advent-2026-09": "927e3ba15d3bc683d1a966dea89e5762b9231f8b8867b6abf69340b678a5fdb9",
    "advent-2026-10": "1d386b5fded40f974023d7ab00f39ffd3c63bbd20b30389a939a5ca13b3aa6d2"
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
