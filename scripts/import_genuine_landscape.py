#!/usr/bin/env python3
"""Import five genuine (no blurred sidebars) 3:2 landscape compositions."""
import hashlib
import pathlib
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
PREFIX = "app/src/main/assets/art/"
EXPECTED = {
    "fliegender-kuchen": "74538d43a1f64268732c4e3f5efd8d275482d04d02889d30888258eccf7d59f7",
    "schatztruhe": "81bb7657e0ea1a178b01ddcddb65f8e8c4bcc2ab60ef27e748b973001c143a5e",
    "zauberpilz": "f6f46ed7c30c5592e5c5c8e60ca43bff05b5d2312b7b0dc9e880465711cea067",
    "decke": "4ceb3084402cd5bd97e3cf13449df7a27bb04a9bceb598d98bb30eff7d2a5c5a",
    "picknick": "75e7555f800e72a9d3c1841f7e54cd2fd6f38ab6a0b86ad36e5668c2b94da819"
}

def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: import_genuine_landscape.py <GuteN8_5_Echte_Querformatbilder.zip>")
    with zipfile.ZipFile(sys.argv[1]) as archive:
        names = set(archive.namelist())
        wanted = {PREFIX + i + ".webp" for i in EXPECTED}
        if names != wanted:
            raise SystemExit(f"Unexpected artwork names: {names ^ wanted}")
        content = {}
        for id, digest in EXPECTED.items():
            raw = archive.read(PREFIX + id + ".webp")
            if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
                raise SystemExit(f"Not a valid WebP: {id}")
            if hashlib.sha256(raw).hexdigest() != digest:
                raise SystemExit(f"Checksum mismatch: {id}")
            content[id] = raw
    for id, raw in content.items():
        target = ROOT / PREFIX / (id + ".webp")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
        print(f"Genuine landscape imported: {id}")

if __name__ == "__main__":
    main()
