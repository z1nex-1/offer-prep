import math
import random


def fit(xs, ys, R, lr):
    n = len(xs)
    base = sum(ys) / n
    F = [base] * n
    stumps = []
    gap = float('inf')
    vals = sorted(set(xs))
    for _ in range(R):
        r = [y - f for y, f in zip(ys, F)]
        cands = []
        for a, b in zip(vals, vals[1:]):
            t = (a + b) / 2
            L = [ri for xi, ri in zip(xs, r) if xi <= t]
            Rr = [ri for xi, ri in zip(xs, r) if xi > t]
            lv, rv = sum(L) / len(L), sum(Rr) / len(Rr)
            sse = sum((v - lv) ** 2 for v in L) + sum((v - rv) ** 2 for v in Rr)
            cands.append((sse, t, lv, rv))
        cands.sort()
        if len(cands) > 1:
            gap = min(gap, (cands[1][0] - cands[0][0]) / max(1.0, cands[0][0]))
        _, t, lv, rv = cands[0]
        stumps.append((t, lv, rv))
        F = [f + lr * (lv if x <= t else rv) for f, x in zip(F, xs)]
    return base, stumps, F, gap


def fast_gap(xs, ys, R, lr):
    n = len(xs)
    order = sorted(range(n), key=lambda i: xs[i])
    F = [sum(ys) / n] * n
    gap = float('inf')
    for _ in range(R):
        r = [ys[i] - F[i] for i in order]
        S = sum(r)
        tot = sum(v * v for v in r)
        SL = 0.0
        c = []
        for pos in range(n - 1):
            SL += r[pos]
            if xs[order[pos]] == xs[order[pos + 1]]:
                continue
            m = pos + 1
            c.append((SL * SL / m + (S - SL) ** 2 / (n - m), (xs[order[pos]] + xs[order[pos + 1]]) / 2, SL / m, (S - SL) / (n - m)))
        c.sort(reverse=True)
        if len(c) > 1:
            gap = min(gap, (c[0][0] - c[1][0]) / max(1.0, tot - c[0][0]))
        _, t, lv, rv = c[0]
        F = [F[i] + lr * (lv if xs[i] <= t else rv) for i in range(n)]
    return gap


def case(xs, ys, R, lr, qs):
    return f"{len(xs)} {R} {lr}\n" + ''.join(f"{x} {y}\n" for x, y in zip(xs, ys)) + f"{len(qs)}\n" + ''.join(f"{x}\n" for x in qs)


def data(n, lim, noise, f):
    xs = [random.randint(-lim, lim) for _ in range(n)]
    return xs, [max(-10 ** 4, min(10 ** 4, int(f(x) + random.gauss(0, noise)))) for x in xs]


def tests():
    random.seed(411)
    out = [case([1, 2, 3, 4], [1, 1, 5, 5], 1, 1.0, [0, 3, 10]), case([1, 2, 3, 4, 5, 6], [2, 4, 3, 8, 9, 7], 3, 0.5, [1, 4, 6])]
    out.append(case([0, 1], [0, 10], 2, 0.1, [0, 1, 5]))
    specs = ((10, 20, 3, 5, 0.3, lambda x: 3 * x), (60, 100, 10, 20, 0.2, lambda x: 500 * math.sin(x / 20)), (300, 1000, 50, 30, 0.1, lambda x: x * x / 200))
    for n, lim, noise, R, lr, f in specs:
        while True:
            xs, ys = data(n, lim, noise, f)
            if len(set(xs)) > 1 and fit(xs, ys, R, lr)[3] > 1e-6:
                break
        out.append(case(xs, ys, R, lr, [random.randint(-lim - 5, lim + 5) for _ in range(20)]))
    for n, lim, noise, R, lr, f in ((5000, 10 ** 6, 300, 50, 0.1, lambda x: 3000 * math.sin(x / 2e5) + x / 500), (3000, 50, 100, 40, 0.3, lambda x: 40 * abs(x))):
        while True:
            xs, ys = data(n, lim, noise, f)
            if fast_gap(xs, ys, R, lr) > 1e-7:
                break
        out.append(case(xs, ys, R, lr, [random.randint(-lim, lim) for _ in range(1000)]))
    return out


def brute(inp):
    d = inp.split()
    n, R, lr = int(d[0]), int(d[1]), float(d[2])
    if n > 400:
        return None
    xs = [int(d[3 + 2 * i]) for i in range(n)]
    ys = [int(d[4 + 2 * i]) for i in range(n)]
    base, stumps, F, _ = fit(xs, ys, R, lr)
    q = int(d[3 + 2 * n])
    res = [f"{sum((y - f) ** 2 for y, f in zip(ys, F)) / n:.9f}"]
    for j in range(q):
        x = int(d[4 + 2 * n + j])
        res.append(f"{base + lr * sum(lv if x <= t else rv for t, lv, rv in stumps):.9f}")
    return '\n'.join(res)
