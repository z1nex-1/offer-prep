import random


def case(rows):
    d = len(rows[0]) - 1
    return f"{len(rows)} {d}\n" + ''.join(' '.join(map(str, r)) + '\n' for r in rows)


def gen(n, d, lim, noise):
    w = [random.uniform(-5, 5) for _ in range(d + 1)]
    rows = []
    for _ in range(n):
        x = [random.randint(-lim, lim) for _ in range(d)]
        y = w[0] + sum(a * b for a, b in zip(w[1:], x)) + random.gauss(0, noise)
        rows.append(x + [max(-1000, min(1000, round(y)))])
    return rows


def tests():
    random.seed(412)
    out = [case([[1, 3], [2, 5], [3, 7], [4, 9]]), case([[0, 0, 1], [1, 0, 2], [0, 1, 3], [1, 1, 5], [2, 1, 6]])]
    out.append(case([[0, 5], [10, 5]]))
    out.append(case([[1, 1], [2, 2], [3, 2], [4, 5]]))
    for n, d, lim, noise in ((10, 1, 20, 3), (30, 2, 50, 10), (200, 3, 100, 20), (1000, 5, 100, 30), (5000, 5, 30, 5)):
        out.append(case(gen(n, d, lim, noise)))
    return out


def brute(inp):
    from fractions import Fraction
    d = list(map(int, inp.split()))
    n, k = d[0], d[1]
    if n > 300:
        return None
    rows, ys = [], []
    for i in range(n):
        r = d[2 + i * (k + 1): 2 + (i + 1) * (k + 1)]
        rows.append([1] + r[:k])
        ys.append(r[k])
    m = k + 1
    A = [[Fraction(sum(r[i] * r[j] for r in rows)) for j in range(m)] + [Fraction(sum(r[i] * y for r, y in zip(rows, ys)))] for i in range(m)]
    for c in range(m):
        p = next(r for r in range(c, m) if A[r][c] != 0)
        A[c], A[p] = A[p], A[c]
        for r in range(m):
            if r != c and A[r][c]:
                f = A[r][c] / A[c][c]
                A[r] = [a - f * b for a, b in zip(A[r], A[c])]
    return ' '.join(f"{float(A[i][m] / A[i][i]):.9f}" for i in range(m))
