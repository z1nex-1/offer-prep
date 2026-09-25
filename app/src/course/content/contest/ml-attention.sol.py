import sys
from math import exp, sqrt

data = sys.stdin.read().split()
T, d, m, c = int(data[0]), int(data[1]), int(data[2]), int(data[3])
vals = list(map(int, data[4:]))
Q = [vals[i * d:(i + 1) * d] for i in range(T)]
K = [vals[T * d + i * d:T * d + (i + 1) * d] for i in range(T)]
off = 2 * T * d
V = [vals[off + i * m:off + (i + 1) * m] for i in range(T)]
scale = sqrt(d)
out = []
for i in range(T):
    last = i + 1 if c else T
    s = [sum(a * b for a, b in zip(Q[i], K[j])) / scale for j in range(last)]
    mx = max(s)
    w = [exp(x - mx) for x in s]
    tot = sum(w)
    row = [sum(w[j] * V[j][t] for j in range(last)) / tot for t in range(m)]
    out.append(' '.join(f"{round(x, 9) + 0.0:.9f}" for x in row))
print('\n'.join(out))
