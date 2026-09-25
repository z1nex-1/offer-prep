import random


def case(Q, K, V, c):
    T, d, m = len(Q), len(Q[0]), len(V[0])
    return f"{T} {d} {m} {c}\n" + ''.join(' '.join(map(str, r)) + '\n' for r in Q + K + V)


def rnd(h, w, lim):
    return [[random.randint(-lim, lim) for _ in range(w)] for _ in range(h)]


def tests():
    random.seed(419)
    out = [case([[1, 0], [0, 1]], [[1, 0], [0, 1]], [[1, 2], [3, 4]], 0), case([[1, 1], [1, 1], [2, 0]], [[1, 0], [0, 1], [1, 1]], [[10], [20], [30]], 1)]
    out.append(case([[3]], [[5]], [[7, -7]], 1))
    out.append(case([[0, 0]] * 3, [[1, 2], [3, 4], [5, 6]], [[1], [2], [6]], 0))
    for T, d, m, lim, c in ((4, 2, 2, 3, 0), (10, 4, 3, 5, 1), (50, 8, 8, 20, 0), (200, 16, 16, 20, 1), (200, 16, 4, 2, 0)):
        out.append(case(rnd(T, d, lim), rnd(T, d, lim), rnd(T, m, lim), c))
    return out


def brute(inp):
    from math import exp, sqrt
    v = list(map(int, inp.split()))
    T, d, m, c = v[:4]
    if T > 60:
        return None
    Q = [v[4 + i * d:4 + (i + 1) * d] for i in range(T)]
    K = [v[4 + T * d + i * d:4 + T * d + (i + 1) * d] for i in range(T)]
    V = [v[4 + 2 * T * d + i * m:4 + 2 * T * d + (i + 1) * m] for i in range(T)]
    res = []
    for i in range(T):
        s = [sum(Q[i][t] * K[j][t] for t in range(d)) / sqrt(d) if (not c or j <= i) else None for j in range(T)]
        mx = max(x for x in s if x is not None)
        w = [exp(x - mx) if x is not None else 0.0 for x in s]
        z = sum(w)
        res.append(' '.join(f"{round(sum(w[j] * V[j][t] for j in range(T)) / z, 9) + 0.0:.9f}" for t in range(m)))
    return '\n'.join(res)
