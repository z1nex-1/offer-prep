import heapq
import sys
from collections import Counter

data = sys.stdin.read().split()
pos = 0
n, d, k = int(data[0]), int(data[1]), int(data[2])
pos = 3
pts, labels = [], []
for _ in range(n):
    pts.append(tuple(int(v) for v in data[pos:pos + d]))
    labels.append(int(data[pos + d]))
    pos += d + 1
q = int(data[pos])
pos += 1
out = []
for _ in range(q):
    x = [int(v) for v in data[pos:pos + d]]
    pos += d
    nearest = heapq.nsmallest(k, ((sum((a - b) ** 2 for a, b in zip(p, x)), i) for i, p in enumerate(pts)))
    votes = Counter(labels[i] for _, i in nearest)
    out.append(max(votes.items(), key=lambda kv: (kv[1], -kv[0]))[0])
print('\n'.join(map(str, out)))
