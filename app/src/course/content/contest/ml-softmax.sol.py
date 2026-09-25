import sys
from math import exp, log

data = sys.stdin.buffer.read().split()
n, K = int(data[0]), int(data[1])
pos = 2
loss = 0.0
hit = 0
for _ in range(n):
    z = [int(v) for v in data[pos:pos + K]]
    t = int(data[pos + K]) - 1
    pos += K + 1
    m = max(z)
    loss += m + log(sum(exp(v - m) for v in z)) - z[t]
    if z.index(m) == t:
        hit += 1
print(f"{loss / n:.9f} {hit / n:.9f}")
