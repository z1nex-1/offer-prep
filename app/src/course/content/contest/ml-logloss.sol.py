import sys
from math import log

EPS = 1e-15


def logloss(y, p):
    s = 0.0
    for t, q in zip(y, p):
        q = min(max(q, EPS), 1 - EPS)
        s += log(q) if t else log(1 - q)
    return -s / len(y)


data = sys.stdin.read().split()
n = int(data[0])
y = [int(x) for x in data[1:1 + n]]
p = [float(x) for x in data[1 + n:1 + 2 * n]]
c = sum(y) / n
print(f"{logloss(y, p):.9f} {logloss(y, [c] * n):.9f}")
