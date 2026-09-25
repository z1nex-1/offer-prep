import random


def case(rows):
    K = len(rows[0]) - 1
    return f"{len(rows)} {K}\n" + ''.join(' '.join(map(str, r)) + '\n' for r in rows)


def gen(n, K, scale, good):
    rows = []
    for _ in range(n):
        t = random.randint(1, K)
        z = [int(random.gauss(0, scale)) for _ in range(K)]
        if random.random() < good:
            z[t - 1] = max(z) + random.randint(0, scale)
        rows.append([max(-10 ** 4, min(10 ** 4, v)) for v in z] + [t])
    return rows


def tests():
    random.seed(416)
    out = [case([[2, 1, 0, 1], [0, 0, 3, 2]]), case([[1000, 0, 1], [0, 1000, 1], [5, 5, 2]])]
    out.append(case([[7, 7, 7, 3]]))
    out.append(case([[-10000, 10000, 1]]))
    for n, K, sc, g in ((10, 3, 2, 0.5), (200, 5, 10, 0.7), (1000, 10, 3000, 0.6), (10000, 4, 5, 0.3)):
        out.append(case(gen(n, K, sc, g)))
    return out


def brute(inp):
    from fractions import Fraction  # noqa: F401
    from math import log, exp
    d = list(map(int, inp.split()))
    n, K = d[0], d[1]
    loss, hit = 0.0, 0
    for i in range(n):
        r = d[2 + i * (K + 1): 2 + (i + 1) * (K + 1)]
        z, t = r[:K], r[K] - 1
        m = max(z)
        s = sum(exp(v - m) for v in z)
        loss += -(z[t] - m - log(s))
        best = min(k for k in range(K) if z[k] == m)
        hit += best == t
    return f"{loss / n:.9f} {hit / n:.9f}"
