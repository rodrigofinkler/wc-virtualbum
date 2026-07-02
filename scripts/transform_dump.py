import re
import sys
from datetime import datetime

INPUT = sys.argv[1]
OUTPUT = sys.argv[2] if len(sys.argv) > 2 else re.sub(r'\.sql$', '_seeded.sql', INPUT)

STICKER_OFFSET = 995  # old sticker IDs start at 996, we want them at 1

in_sticker_copy = False
in_usersticker_copy = False

with open(INPUT) as f_in, open(OUTPUT, 'w') as f_out:
    for line in f_in:
        if line.startswith('COPY public.stickers_sticker '):
            in_sticker_copy = True
            f_out.write(line)
            continue

        if in_sticker_copy:
            if line.strip() == r'\.':
                in_sticker_copy = False
                f_out.write(line)
                continue
            parts = line.split('\t')
            old_id = int(parts[0])
            parts[0] = str(old_id - STICKER_OFFSET)
            f_out.write('\t'.join(parts))
            continue

        if line.startswith('COPY public.stickers_usersticker '):
            in_usersticker_copy = True
            f_out.write(line)
            continue

        if in_usersticker_copy:
            if line.strip() == r'\.':
                in_usersticker_copy = False
                f_out.write(line)
                continue
            parts = line.split('\t')
            old_sticker_id = int(parts[2])
            parts[2] = str(old_sticker_id - STICKER_OFFSET)
            f_out.write('\t'.join(parts))
            continue

        if 'stickers_sticker_id_seq' in line and 'setval' in line:
            f_out.write(
                "SELECT pg_catalog.setval('public.stickers_sticker_id_seq', 994, true);\n"
            )
            continue

        f_out.write(line)

print(f'Written to {OUTPUT}')
