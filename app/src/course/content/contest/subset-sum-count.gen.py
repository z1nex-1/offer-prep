import random
from itertools import combinations


def fmt(s, a):
    return f'{len(a)} {s}\n{" ".join(map(str, a))}\n'


def tests():
    random.seed(7)
    out = [fmt(5, [1, 2, 3, 4, 5]), fmt(0, [1, -1, 2, -2]), fmt(0, [5]), fmt(0, [0]), fmt(3, [3, 3, 3]),
           fmt(7, [1, 2, 4]), fmt(8, [1, 2, 4]), fmt(0, [0] * 10), fmt(-4, [-1, -2, -3, 5, 1])]
    for n in (8, 12, 16):
        a = [random.randint(-10, 10) for _ in range(n)]
        out.append(fmt(random.randint(-15, 15), a))
    out.append(fmt(10, [random.randint(-5, 5) for _ in range(18)]))
    out.append(fmt(0, [0] * 18))
    a = [random.randint(-10**8, 10**8) for _ in range(18)]
    out.append(fmt(sum(a[::3]), a))
    out.append(fmt(10**9, [10**8] * 18))
    out.append(fmt(900, [100, 200, 300, 400, 500, 600, 700, 800, 900] * 2))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, s, a = d[0], d[1], d[2:]
    return sum(sum(c) == s for k in range(1, n + 1) for c in combinations(a, k))
