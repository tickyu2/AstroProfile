#!/usr/bin/env python3
"""Move JiaYin profile to Section 9 and clean up metadata."""
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = os.path.join('c:', os.sep, 'astroprofile', 'docs', '00_To Do', '06_YinWood_YinFireSnake.md')

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
total = len(lines)
print(f'Original: {total} lines, {len(content)} bytes')

# ============================================================
# STEP 1: Find the JiaYin profile block
# ============================================================

profile_start = None
for i, line in enumerate(lines):
    if line.strip().startswith('## FULL PROFILE:') and '\u7532\u5bc5' in line:
        profile_start = i
        break

html_comment_line = None
for i, line in enumerate(lines):
    if '<!-- \u58ec\u5b50 full profile:' in line:
        html_comment_line = i
        break

print(f'Profile starts at line {profile_start}')
print(f'HTML comment at line {html_comment_line}')

# Find the --- before the HTML comment
profile_end_separator = html_comment_line - 1
while profile_end_separator >= 0 and lines[profile_end_separator].strip() == '':
    profile_end_separator -= 1
print(f'Profile end separator at line {profile_end_separator}: [{lines[profile_end_separator].strip()}]')

# Profile content: from profile_start to just before the trailing ---
profile_block = lines[profile_start:profile_end_separator]
print(f'Profile block: lines {profile_start} to {profile_end_separator - 1} ({len(profile_block)} lines)')

# ============================================================
# STEP 2: Find the metadata block before the profile to remove
# ============================================================

meta_end = profile_start - 1
while meta_end >= 0 and lines[meta_end].strip() == '':
    meta_end -= 1
assert lines[meta_end].strip() == '---', f'Expected --- at {meta_end}, got: [{lines[meta_end].strip()}]'

idx = meta_end - 1
while idx >= 0 and lines[idx].strip() == '':
    idx -= 1
assert 'February 18, 2026' in lines[idx], f'Expected date at {idx}'
idx -= 1
assert 'Parts 3 & 4 Complete' in lines[idx], f'Expected Parts at {idx}'
idx -= 1
assert 'Built with Pure Gold' in lines[idx], f'Expected Built at {idx}'
idx -= 1
while idx >= 0 and lines[idx].strip() == '':
    idx -= 1
assert 'FOR THE FOREST' in lines[idx], f'Expected emoji line at {idx}'
idx -= 1
while idx >= 0 and lines[idx].strip() == '':
    idx -= 1
assert lines[idx].strip() == '---', f'Expected --- at {idx}'

meta_start = idx

remove_block_start = meta_start
remove_block_end = html_comment_line
while remove_block_end + 1 < total and lines[remove_block_end + 1].strip() == '':
    remove_block_end += 1

print(f'Remove main block: lines {remove_block_start} to {remove_block_end}')

# ============================================================
# STEP 3: Collect word count metadata blocks to remove
# ============================================================

wc_blocks = []
i = 0
while i < total:
    if lines[i].strip().startswith('*Word count:'):
        wc_start = i
        wc_end = i

        if wc_end + 1 < total and lines[wc_end + 1].strip().startswith('*Part of'):
            wc_end += 1

        bs = wc_start - 1
        while bs >= 0 and lines[bs].strip() == '':
            bs -= 1
        if bs >= 0 and lines[bs].strip() == '---':
            wc_start = bs

        fe = wc_end + 1
        while fe < total and lines[fe].strip() == '':
            fe += 1
        if fe < total and lines[fe].strip() == '---':
            wc_end = fe

        wc_blocks.append((wc_start, wc_end))
        print(f'WC block to remove: lines {wc_start}-{wc_end}')
        i = wc_end + 1
    else:
        i += 1

# ============================================================
# STEP 4: Build set of lines to remove
# ============================================================

remove_lines = set()

for i in range(remove_block_start, remove_block_end + 1):
    remove_lines.add(i)

for start, end in wc_blocks:
    for i in range(start, end + 1):
        remove_lines.add(i)

print(f'Total lines to remove: {len(remove_lines)}')

# ============================================================
# STEP 5: Build new file
# ============================================================

quick_profiles_line = None
for i, line in enumerate(lines):
    if '## QUICK PROFILES: WOOD PARTNERS' in line:
        quick_profiles_line = i
        break

print(f'Insert before QUICK PROFILES at line {quick_profiles_line}')

new_lines = []
inserted = False

for i in range(total):
    if i in remove_lines:
        continue

    if i == quick_profiles_line and not inserted:
        inserted = True
        new_lines.append('## FEATURED PROFILE: \u7532\u5bc5 (Ji\u01ce Y\u00edn) \u2014 Yang Wood Yang Fire Tiger \u2014 82%')
        new_lines.append('')
        for pline in profile_block[1:]:
            new_lines.append(pline)
        last_non_blank = len(new_lines) - 1
        while last_non_blank >= 0 and new_lines[last_non_blank].strip() == '':
            last_non_blank -= 1
        if new_lines[last_non_blank].strip() != '---':
            new_lines.append('')
            new_lines.append('---')
        new_lines.append('')

    new_lines.append(lines[i])

new_content = '\n'.join(new_lines)

# ============================================================
# STEP 6: Write
# ============================================================

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

new_size = os.path.getsize(filepath)
new_total = len(new_content.split('\n'))
print()
print('=== RESULT ===')
print(f'New file: {new_total} lines, {new_size:,} bytes ({new_size/1024:.1f} KB)')
print(f'Change: {new_total - total} lines, {new_size - len(content):+,} bytes')
