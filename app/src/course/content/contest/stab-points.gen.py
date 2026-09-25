import random
from itertools import combinations


def make(segs):
    return f'{len(segs)}\n' + ''.join(f'{l} {r}\n' for l, r in segs)


def rnd_segs(n, c, maxlen):
    out = []
    for _ in range(n):
        l = random.randint(0, c)
        out.append((l, min(c, l + random.randint(0, maxlen))))
    return out


def tests():
    random.seed(71)
    out = [make([(1, 3), (2, 5), (3, 6), (7, 9), (8, 10)]), make([(0, 100), (1, 2), (3, 4), (50, 60)]),
           make([(5, 5)]), make([(1, 3), (3, 5), (5, 7)]), make([(0, 10), (2, 3), (2, 3), (4, 5)]),
           make([(0, 1000000)] * 3), make([(i, i) for i in range(10)])]
    for n, c, ml in ((5, 10, 3), (8, 20, 6), (10, 30, 10), (12, 15, 4)):
        for _ in range(3):
            out.append(make(rnd_segs(n, c, ml)))
    n = 20000
    out.append(make(rnd_segs(n, 10**6, 100)))
    out.append(make(rnd_segs(n, 10**6, 10**5)))
    out.append(make(sorted(rnd_segs(n, 10**6, 30), key=lambda s: -s[0])))
    return out


def brute(inp):
    data = list(map(int, inp.split()))
    n = data[0]
    if n > 12:
        return None
    segs = [(data[1 + 2 * i], data[2 + 2 * i]) for i in range(n)]
    cand = sorted({r for _, r in segs} | {l for l, _ in segs})
    for k in range(1, n + 1):
        for pts in combinations(cand, k):
            if all(any(l <= p <= r for p in pts) for l, r in segs):
                return k
