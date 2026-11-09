#!/usr/bin/env python3
"""Import five newly authored GuteN8 illustration WebPs from a verified ZIP."""
from pathlib import Path
from hashlib import sha256
from zipfile import ZipFile
import sys

ROOT=Path(__file__).resolve().parents[1]
PREFIX="app/src/main/assets/art/"
EXPECTED={
    "mondboot-am-see": "9f24f8da3ded59f7eaf75d7fe8119cfcd172ff98256bfdaff62fddccf76966de",
    "glitzerblume-im-wald": "c2e1dccaaa0504316c190961bde33d3e1fe7272c6853865fb7ab13d984fd620c",
    "wolkenkeks": "3b08806d9bae4e92b6f4476a66c9464c205192de7eb5d20e347ac87ceb2eff71",
    "sternenlaterne": "9663a86af26adb265f8f6a104e58327f4361e526db49257e34ec35a89a6d513d",
    "sternschnuppenhuegel": "8fdb27cdb2994431307328324ab6f046e09119e9869571e93e78a57d9c7144b9"
}

def main():
    if len(sys.argv)!=2:
        raise SystemExit("Usage: import_five_new_story_images.py <zip>")
    with ZipFile(sys.argv[1]) as z:
        wanted={PREFIX+id+".webp" for id in EXPECTED}
        files=set(z.namelist())
        if files!=wanted:
            raise SystemExit("Incorrect files in illustration archive")
        verified={}
        for id,digest in EXPECTED.items():
            data=z.read(PREFIX+id+".webp")
            if data[:4]!=b"RIFF" or data[8:12]!=b"WEBP":
                raise SystemExit("Not WebP: "+id)
            if sha256(data).hexdigest()!=digest:
                raise SystemExit("Unexpected artwork bytes: "+id)
            verified[id]=data
    for id,data in verified.items():
        target=ROOT/PREFIX/(id+".webp")
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(data)
        print("Imported "+id)

if __name__=="__main__":
    main()
