import random


def case(train, test):
    d = len(train[0])
    return f"{len(train)} {len(test)} {d}\n" + ''.join(' '.join(map(str, r)) + '\n' for r in train + test)


def tests():
    random.seed(415)
    out = [case([[1, 10], [3, 10], [5, 10]], [[3, 10], [7, 0]]), case([[0], [4]], [[2], [-2], [8]])]
    out.append(case([[5, 5, 5]], [[5, 6, 4]]))
    out.append(case([[10 ** 6, -10 ** 6], [10 ** 6 - 1, 10 ** 6]], [[0, 0]]))
    for n, m, d, lim in ((5, 5, 2, 10), (100, 50, 3, 1000), (1000, 1000, 5, 10 ** 6)):
        tr = [[random.randint(-lim, lim) for _ in range(d)] for _ in range(n)]
        for r in tr:
            r[-1] = 7
        te = [[random.randint(-lim, lim) for _ in range(d)] for _ in range(m)]
        out.append(case(tr, te))
    tr = [[int(random.gauss(5 * 10 ** 5, 10)) for _ in range(4)] for _ in range(10000)]
    te = [[int(random.gauss(5 * 10 ** 5, 30)) for _ in range(4)] for _ in range(3000)]
    out.append(case(tr, te))
    return out


def brute(inp):
    from fractions import Fraction
    d = list(map(int, inp.split()))
    n, m, k = d[0], d[1], d[2]
    if n > 200:
        return None
    rows = [d[3 + i * k:3 + (i + 1) * k] for i in range(n + m)]
    tr, te = rows[:n], rows[n:]
    res = []
    mu = [Fraction(sum(r[j] for r in tr), n) for j in range(k)]
    var = [sum((r[j] - mu[j]) ** 2 for r in tr) / n for j in range(k)]
    for r in te:
        res.append(' '.join(f"{float((r[j] - mu[j])) / float(var[j]) ** 0.5:.9f}" if var[j] else '0' for j in range(k)))
    return '\n'.join(res)
