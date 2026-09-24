import sys
from collections import defaultdict

data = sys.stdin.read().split()
n = int(data[0])
groups = defaultdict(list)
for i in range(n):
    name, cls, score = data[1 + 3 * i], int(data[2 + 3 * i]), int(data[3 + 3 * i])
    groups[cls].append((score, name))
out = []
for cls in sorted(groups):
    out.append(f'Class {cls}')
    for score, name in sorted(groups[cls], key=lambda p: (-p[0], p[1])):
        out.append(f'{name} {score}')
print('\n'.join(out))
