import random
from itertools import combinations


def make(L, segs):
    return f'{L} {len(segs)}\n' + ''.join(f'{l} {r}\n' for l, r in segs)


def rnd_segs(n, L, maxlen):
    out = []
    for _ in range(n):
        l = random.randint(-maxlen // 2, L)
        out.append((l, l + random.randint(1, maxlen)))
    return out


def chain(L, k, noise):
    cuts = sorted(random.sample(range(1, L), k - 1))
    pts = [0] + cuts + [L]
    segs = [(pts[i] - random.randint(0, 3), pts[i + 1]) for i in range(k)]
    segs += [(random.randint(0, L), 0) for _ in range(noise)]
    segs = [(l, r) if l < r else (r - random.randint(1, 5), r) for l, r in segs]
    random.shuffle(segs)
    return segs


def tests():
    random.seed(72)
    out = [make(10, [(0, 3), (2, 6), (1, 4), (5, 10), (6, 8)]), make(10, [(0, 3), (4, 10)]),
           make(5, [(0, 3), (3, 5)]), make(5, [(1, 5)]), make(5, [(-10, 100)]), make(6, [(0, 2), (1, 7), (0, 6)]),
           make(10, [(0, 9), (0, 5), (5, 10)]), make(100, [(-5, 0), (0, 1)])]
    for n, L, ml in ((4, 10, 5), (6, 10, 4), (8, 20, 8), (12, 30, 8)):
        for _ in range(3):
            out.append(make(L, rnd_segs(n, L, ml)))
    n = 20000
    out.append(make(10**6, rnd_segs(n, 10**6, 200)))
    out.append(make(10**6, chain(10**6, 12000, 8000)))
    out.append(make(10**6, [(i * 50, i * 50 + 50) for i in range(20000)]))
    return out


def covers(L, segs):
    covered = 0
    for l, r in sorted(segs):
        if l > covered:
            break
        covered = max(covered, r)
    return covered >= L


def brute(inp):
    data = list(map(int, inp.split()))
    L, n = data[0], data[1]
    if n > 12:
        return None
    segs = [(data[2 + 2 * i], data[3 + 2 * i]) for i in range(n)]
    for k in range(1, n + 1):
        for sub in combinations(segs, k):
            if covers(L, sub):
                return k
    return -1
