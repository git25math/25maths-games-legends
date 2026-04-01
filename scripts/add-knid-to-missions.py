#!/usr/bin/env python3
"""
Phase 2B.1b — Add kn_id fields to mission files (y7.ts through y12.ts).

For each mission that has a `kpId`, looks up the KP's kn_id from
KP_KN_MAP and inserts `kn_id: 'kn_XXXX'` on the line after kpId.

Usage:
  python3 scripts/add-knid-to-missions.py           # dry-run (default)
  python3 scripts/add-knid-to-missions.py --apply    # write changes

This is a pure additive change: no existing lines are modified or deleted.
"""

import re
import sys
import os

# KP -> kn_id mapping (matches KP_KN_MAP in kp-registry.ts)
KP_KN_MAP = {
    'kp-1.1-01': 'kn_0001', 'kp-1.1-02': 'kn_0002', 'kp-1.1-03': 'kn_0009',
    'kp-1.1-04': 'kn_0004', 'kp-1.1-05': 'kn_0011', 'kp-1.1-06': 'kn_0003',
    'kp-1.1-07': 'kn_0007', 'kp-1.1-08': 'kn_0005', 'kp-1.1-09': 'kn_0008',
    'kp-1.2-01': 'kn_0012', 'kp-1.2-02': 'kn_0012', 'kp-1.2-03': 'kn_0013',
    'kp-1.2-04': 'kn_0013', 'kp-1.2-05': 'kn_0013',
    'kp-1.3-01': 'kn_0014', 'kp-1.3-02': 'kn_0015', 'kp-1.3-03': 'kn_0019',
    'kp-1.4-01': 'kn_0020', 'kp-1.4-02': 'kn_0030', 'kp-1.4-03': 'kn_0027',
    'kp-1.4-04': 'kn_0031',
    'kp-1.6-01': 'kn_0033', 'kp-1.6-02': 'kn_0311', 'kp-1.6-03': 'kn_0032',
    'kp-1.6-04': 'kn_0034',
    'kp-1.7-01': 'kn_0016', 'kp-1.7-02': 'kn_0018',
    'kp-1.8-01': 'kn_0036', 'kp-1.8-02': 'kn_0037',
    'kp-1.9-01': 'kn_0044', 'kp-1.9-02': 'kn_0043', 'kp-1.9-03': 'kn_0042',
    'kp-1.9-04': 'kn_0045', 'kp-1.9-05': 'kn_0045', 'kp-1.9-06': 'kn_0045',
    'kp-1.9-07': 'kn_0043',
    'kp-1.10-01': 'kn_0046', 'kp-1.10-02': 'kn_0050', 'kp-1.10-03': 'kn_0047',
    'kp-1.10-04': 'kn_0048', 'kp-1.10-05': 'kn_0051',
    'kp-1.11-01': 'kn_0052', 'kp-1.11-02': 'kn_0054', 'kp-1.11-03': 'kn_0055',
    'kp-1.11-04': 'kn_0053', 'kp-1.11-05': 'kn_0054',
    'kp-1.12-01': 'kn_0058', 'kp-1.12-02': 'kn_0056', 'kp-1.12-03': 'kn_0057',
    'kp-1.13-01': 'kn_0062', 'kp-1.13-02': 'kn_0064', 'kp-1.13-03': 'kn_0069',
    'kp-1.13-04': 'kn_0067',
    'kp-1.15-01': 'kn_0075', 'kp-1.15-02': 'kn_0073', 'kp-1.15-03': 'kn_0077',
    'kp-1.16-01': 'kn_0068', 'kp-1.16-02': 'kn_0069', 'kp-1.16-03': 'kn_0078',
    'kp-1.17-01': 'kn_0070',
    'kp-2.1-01': 'kn_0083', 'kp-2.1-02': 'kn_0084', 'kp-2.1-03': 'kn_0083',
    'kp-2.2-01': 'kn_0085', 'kp-2.2-02': 'kn_0086', 'kp-2.2-03': 'kn_0085',
    'kp-2.2-04': 'kn_0087', 'kp-2.2-05': 'kn_0094', 'kp-2.2-06': 'kn_0089',
    'kp-2.2-07': 'kn_0090', 'kp-2.2-08': 'kn_0091', 'kp-2.2-09': 'kn_0093',
    'kp-2.2-10': 'kn_0092', 'kp-2.2-11': 'kn_0096', 'kp-2.2-12': 'kn_0019',
    'kp-2.2-13': 'kn_0095',
    'kp-2.3-01': 'kn_0097', 'kp-2.3-02': 'kn_0307', 'kp-2.3-03': 'kn_0098',
    'kp-2.3-04': 'kn_0309',
    'kp-2.4-01': 'kn_0099', 'kp-2.4-02': 'kn_0101', 'kp-2.4-03': 'kn_0100',
    'kp-2.5-01': 'kn_0103', 'kp-2.5-02': 'kn_0104', 'kp-2.5-03': 'kn_0106',
    'kp-2.5-04': 'kn_0105', 'kp-2.5-05': 'kn_0110', 'kp-2.5-06': 'kn_0110',
    'kp-2.5-07': 'kn_0110', 'kp-2.5-08': 'kn_0107', 'kp-2.5-09': 'kn_0108',
    'kp-2.5-10': 'kn_0109', 'kp-2.5-11': 'kn_0108', 'kp-2.5-12': 'kn_0303',
    'kp-2.5-13': 'kn_0107',
    'kp-2.6-01': 'kn_0111', 'kp-2.6-02': 'kn_0111', 'kp-2.6-03': 'kn_0111',
    'kp-2.6-04': 'kn_0112',
    'kp-2.7-01': 'kn_0113', 'kp-2.7-02': 'kn_0115', 'kp-2.7-03': 'kn_0114',
    'kp-2.7-04': 'kn_0116', 'kp-2.7-05': 'kn_0117',
    'kp-2.8-01': 'kn_0121', 'kp-2.8-02': 'kn_0122', 'kp-2.8-03': 'kn_0120',
    'kp-2.8-04': 'kn_0120', 'kp-2.8-05': 'kn_0121', 'kp-2.8-06': 'kn_0123',
    'kp-2.8-07': 'kn_0123', 'kp-2.8-08': 'kn_0122',
    'kp-2.9-01': 'kn_0124', 'kp-2.9-02': 'kn_0125', 'kp-2.9-03': 'kn_0126',
    'kp-2.9-04': 'kn_0125', 'kp-2.9-05': 'kn_0124',
    'kp-2.10-01': 'kn_0127', 'kp-2.10-02': 'kn_0129', 'kp-2.10-03': 'kn_0130',
    'kp-2.10-04': 'kn_0130',
    'kp-2.11-01': 'kn_0131', 'kp-2.11-02': 'kn_0132', 'kp-2.11-03': 'kn_0133',
    'kp-2.13-01': 'kn_0134', 'kp-2.13-02': 'kn_0136', 'kp-2.13-03': 'kn_0135',
    'kp-2.13-04': 'kn_0134',
    'kp-3.1-01': 'kn_0137', 'kp-3.1-02': 'kn_0137',
    'kp-3.2-01': 'kn_0141',
    'kp-3.3-01': 'kn_0140', 'kp-3.3-02': 'kn_0140',
    'kp-3.4-01': 'kn_0138', 'kp-3.4-02': 'kn_0139', 'kp-3.4-03': 'kn_0139',
    'kp-3.4-04': 'kn_0138',
    'kp-3.5-01': 'kn_0141', 'kp-3.5-02': 'kn_0141', 'kp-3.5-03': 'kn_0141',
    'kp-3.5-04': 'kn_0141',
    'kp-3.6-01': 'kn_0140', 'kp-3.6-02': 'kn_0141',
    'kp-3.7-01': 'kn_0142',
    'kp-4.4-01': 'kn_0313', 'kp-4.4-02': 'kn_0314', 'kp-4.4-03': 'kn_0315',
    'kp-4.6-01': 'kn_0145', 'kp-4.6-02': 'kn_0146', 'kp-4.6-03': 'kn_0148',
    'kp-4.6-04': 'kn_0148', 'kp-4.6-05': 'kn_0149', 'kp-4.6-06': 'kn_0149',
    'kp-4.6-07': 'kn_0149', 'kp-4.6-08': 'kn_0149', 'kp-4.6-09': 'kn_0146',
    'kp-4.6-10': 'kn_0149',
    'kp-4.7-01': 'kn_0318', 'kp-4.7-02': 'kn_0317', 'kp-4.7-03': 'kn_0320',
    'kp-4.7-04': 'kn_0319', 'kp-4.7-05': 'kn_0318', 'kp-4.7-06': 'kn_0320',
    'kp-5.2-01': 'kn_0329', 'kp-5.2-02': 'kn_0329', 'kp-5.2-03': 'kn_0329',
    'kp-5.3-01': 'kn_0330', 'kp-5.3-02': 'kn_0330', 'kp-5.3-03': 'kn_0150',
    'kp-5.3-04': 'kn_0151', 'kp-5.3-05': 'kn_0150', 'kp-5.3-06': 'kn_0330',
    'kp-6.1-01': 'kn_0313', 'kp-6.1-02': 'kn_0314',
    'kp-6.2-01': 'kn_0326', 'kp-6.2-02': 'kn_0327', 'kp-6.2-03': 'kn_0328',
    'kp-6.4-01': 'kn_0153', 'kp-6.4-02': 'kn_0154', 'kp-6.4-03': 'kn_0153',
    'kp-7.2-01': 'kn_0322', 'kp-7.2-02': 'kn_0323', 'kp-7.2-03': 'kn_0325',
    'kp-7.3-01': 'kn_0322', 'kp-7.4-01': 'kn_0324', 'kp-7.4-02': 'kn_0325',
    'kp-8.1-01': 'kn_0155', 'kp-8.1-02': 'kn_0156',
    'kp-8.2-01': 'kn_0157', 'kp-8.2-02': 'kn_0157',
    'kp-8.3-01': 'kn_0155', 'kp-8.3-02': 'kn_0158', 'kp-8.3-03': 'kn_0158',
    'kp-8.3-04': 'kn_0158', 'kp-8.3-05': 'kn_0156', 'kp-8.3-06': 'kn_0155',
    'kp-8.3-07': 'kn_0155', 'kp-8.3-08': 'kn_0155',
    'kp-8.4-01': 'kn_0160', 'kp-8.4-02': 'kn_0161',
    'kp-9.1-01': 'kn_0162', 'kp-9.1-02': 'kn_0162',
    'kp-9.3-01': 'kn_0164', 'kp-9.3-02': 'kn_0163', 'kp-9.3-03': 'kn_0165',
    'kp-9.3-04': 'kn_0165', 'kp-9.3-05': 'kn_0166', 'kp-9.3-06': 'kn_0167',
    'kp-9.5-01': 'kn_0168', 'kp-9.5-02': 'kn_0169', 'kp-9.5-03': 'kn_0169',
    'kp-9.5-04': 'kn_0168',
}

MISSIONS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'missions')
MISSION_FILES = ['y7.ts', 'y8.ts', 'y9.ts', 'y10.ts', 'y11.ts', 'y12.ts']

KP_PATTERN = re.compile(r"(\s*)kpId:\s*'(kp-[\d.]+-\d+)'")


def process_file(filepath: str, apply: bool = False) -> dict:
    """Process a single mission file. Returns stats."""
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    stats = {'total_kpId': 0, 'added_kn_id': 0, 'skipped': 0, 'already_has': 0}

    i = 0
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)

        m = KP_PATTERN.match(line)
        if m:
            stats['total_kpId'] += 1
            indent = m.group(1)
            kp_id = m.group(2)

            # Check if next line already has kn_id
            if i + 1 < len(lines) and 'kn_id:' in lines[i + 1]:
                stats['already_has'] += 1
                i += 1
                continue

            kn_id = KP_KN_MAP.get(kp_id)
            if kn_id:
                new_lines.append(f"{indent}kn_id: '{kn_id}',\n")
                stats['added_kn_id'] += 1
            else:
                stats['skipped'] += 1

        i += 1

    if apply and stats['added_kn_id'] > 0:
        with open(filepath, 'w') as f:
            f.writelines(new_lines)

    return stats


def main():
    apply = '--apply' in sys.argv
    mode = 'APPLY' if apply else 'DRY-RUN'
    print(f"=== add-knid-to-missions.py [{mode}] ===\n")

    total_stats = {'total_kpId': 0, 'added_kn_id': 0, 'skipped': 0, 'already_has': 0}

    for fname in MISSION_FILES:
        fpath = os.path.join(MISSIONS_DIR, fname)
        if not os.path.exists(fpath):
            print(f"  SKIP {fname} (not found)")
            continue

        stats = process_file(fpath, apply=apply)
        print(f"  {fname}: {stats['total_kpId']} kpIds, "
              f"+{stats['added_kn_id']} kn_ids, "
              f"{stats['skipped']} unmapped, "
              f"{stats['already_has']} already present")

        for k in total_stats:
            total_stats[k] += stats[k]

    print(f"\n  TOTAL: {total_stats['total_kpId']} kpIds, "
          f"+{total_stats['added_kn_id']} kn_ids added, "
          f"{total_stats['skipped']} unmapped, "
          f"{total_stats['already_has']} already present")

    if not apply:
        print("\n  (dry-run mode — use --apply to write changes)")


if __name__ == '__main__':
    main()
