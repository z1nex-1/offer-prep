import heapq
import sys

data = sys.stdin.read().split()
n, k = int(data[0]), int(data[1])
h = []
res = []
for x in map(int, data[2:2 + n]):
    if len(h) < k:
        heapq.heappush(h, x)
    elif x > h[0]:
        heapq.heapreplace(h, x)
    res.append(h[0] if len(h) == k else -1)
print(' '.join(map(str, res)))
