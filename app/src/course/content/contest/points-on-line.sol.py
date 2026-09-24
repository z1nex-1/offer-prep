import sys
from math import gcd

data = sys.stdin.read().split()
n = int(data[0])
pts = [(int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n)]
best = 0
for i in range(n):
    px, py = pts[i]
    cnt = {}
    same = 0
    for j in range(i + 1, n):
        dx, dy = pts[j][0] - px, pts[j][1] - py
        if dx == 0 and dy == 0:
            same += 1
            continue
        g = gcd(dx, dy)
        dx, dy = dx // g, dy // g
        if dx < 0 or (dx == 0 and dy < 0):
            dx, dy = -dx, -dy
        cnt[(dx, dy)] = cnt.get((dx, dy), 0) + 1
    best = max(best, same + 1 + max(cnt.values(), default=0))
print(best)
