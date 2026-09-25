import random
from itertools import permutations


def make(jobs):
    return f'{len(jobs)}\n' + ''.join(f'{t} {w}\n' for t, w in jobs)


def rnd(n, c):
    return [(random.randint(1, c), random.randint(1, c)) for _ in range(n)]


def tests():
    random.seed(83)
    out = [make([(3, 1), (1, 2), (2, 5)]), make([(10, 1), (1, 1), (5, 10), (4, 4)]),
           make([(7, 3)]), make([(2, 2), (1, 1), (3, 3)]), make([(1, 10**9), (10**9, 1)]),
           make([(5, 1), (1, 5), (5, 5), (1, 1)])]
    for n, c in ((3, 5), (5, 10), (6, 4), (7, 100), (7, 10**9)):
        for _ in range(3):
            out.append(make(rnd(n, c)))
    out.append(make([(m - 1, m) for m in range(10**9, 10**9 - 3000, -1)]))
    out.append(make([(m, m + 1) for m in range(10**9 - 2, 10**9 - 2002, -1)] + rnd(1000, 10**9)))
    out.append(make(rnd(20000, 10**9)))
    out.append(make(rnd(20000, 100)))
    out.append(make([(random.randint(1, 10**9), 1) for _ in range(20000)]))
    return out


def brute(inp):
    data = list(map(int, inp.split()))
    n = data[0]
    if n > 7:
        return None
    jobs = [(data[1 + 2 * i], data[2 + 2 * i]) for i in range(n)]
    best = None
    for p in permutations(jobs):
        now = total = 0
        for t, w in p:
            now += t
            total += w * now
        if best is None or total < best:
            best = total
    return best
