import sys
from collections import defaultdict
from math import log2


def dcg(rels):
    return sum((2 ** r - 1) / log2(i + 2) for i, r in enumerate(rels))


data = sys.stdin.buffer.read().split()
n, k = int(data[0]), int(data[1])
groups = defaultdict(list)
for i in range(n):
    q, s, r = data[2 + 3 * i], int(data[3 + 3 * i]), int(data[4 + 3 * i])
    groups[q].append((s, r))
total, cnt = 0.0, 0
for docs in groups.values():
    ideal = dcg(sorted((r for _, r in docs), reverse=True)[:k])
    if ideal == 0:
        continue
    docs.sort(reverse=True)
    total += dcg([r for _, r in docs[:k]]) / ideal
    cnt += 1
print(f"{total / cnt:.9f}")
