import sys
from functools import cmp_to_key

data = sys.stdin.buffer.read().split()
n = int(data[0])
jobs = sorted(zip(map(int, data[1:2 * n + 1:2]), map(int, data[2:2 * n + 2:2])),
              key=cmp_to_key(lambda a, b: a[0] * b[1] - b[0] * a[1]))
now = total = 0
for t, w in jobs:
    now += t
    total += w * now
print(total)
