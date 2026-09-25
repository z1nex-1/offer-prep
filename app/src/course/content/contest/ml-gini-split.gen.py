import random
from fractions import Fraction


def exact_scores(rows):
    rows = sorted(rows)
    xs = sorted(set(x for x, _ in rows))
    n = len(rows)
    res = []
    for a, b in zip(xs, xs[1:]):
        L = [y for x, y in rows if x <= a]
        R = [y for x, y in rows if x > a]
        g = lambda S: 1 - sum(Fraction(S.count(k), len(S)) ** 2 for k in set(S))
        res.append((Fraction(len(L), n) * g(L) + Fraction(len(R), n) * g(R), Fraction(a + b, 2)))
    return sorted(res)


def unique(rows):
    s = exact_scores(rows)
    return len(s) == 1 or s[1][0] - s[0][0] > Fraction(1, 10 ** 7)


def unique_fast(rows):
    # тот же критерий, но за n log n — для больших тестов
    rows = sorted(rows)
    n = len(rows)
    left, right = [0] * 10, [0] * 10
    for _, y in rows:
        right[y] += 1
    vals = []
    for i in range(n - 1):
        left[rows[i][1]] += 1
        right[rows[i][1]] -= 1
        if rows[i + 1][0] != rows[i][0]:
            m = i + 1
            vals.append(Fraction(m * m - sum(c * c for c in left), m) + Fraction((n - m) ** 2 - sum(c * c for c in right), n - m))
    vals.sort()
    return len(vals) == 1 or (vals[1] - vals[0]) / n > Fraction(1, 10 ** 7)


def case(rows):
    return f"{len(rows)}\n" + ''.join(f"{x} {y}\n" for x, y in rows)


def gen(n, classes, lim, sep, check):
    while True:
        rows = []
        for _ in range(n):
            y = random.randrange(classes)
            rows.append((max(-10 ** 9, min(10 ** 9, int(random.gauss(y * sep, lim)))), y))
        if len(set(x for x, _ in rows)) >= 2 and check(rows):
            return rows


def tests():
    random.seed(409)
    out = [case([(1, 0), (2, 0), (3, 1), (4, 1), (5, 0)]), case([(10, 1), (10, 0), (20, 1), (30, 1), (5, 0)])]
    out.append(case([(0, 0), (1, 1)]))
    out.append(case([(-5, 2), (-5, 2), (7, 3), (7, 2), (7, 3), (100, 3)]))
    for n, cl, lim, sep in ((8, 2, 3, 2), (30, 3, 5, 4), (200, 4, 40, 25)):
        out.append(case(gen(n, cl, lim, sep, unique)))
    out.append(case(gen(3000, 5, 10 ** 6, 10 ** 6, unique_fast)))
    out.append(case(gen(50000, 10, 10 ** 7, 3 * 10 ** 6, unique_fast)))
    out.append(case(gen(50000, 2, 100, 20, unique_fast)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    rows = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(n)]
    if n > 300:
        return None
    g, t = exact_scores(rows)[0]
    return f"{float(t):.1f} {float(g):.9f}"
