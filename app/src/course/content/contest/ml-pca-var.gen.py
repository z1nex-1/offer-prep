import random


def case(X):
    return f"{len(X)} {len(X[0])}\n" + ''.join(' '.join(map(str, r)) + '\n' for r in X)


def eig_ok(X):
    # проверка λ₁ ≥ 1.5·λ₂ методом Якоби — без NumPy
    n, d = len(X), len(X[0])
    mu = [sum(r[j] for r in X) / n for j in range(d)]
    A = [[sum((r[a] - mu[a]) * (r[b] - mu[b]) for r in X) / n for b in range(d)] for a in range(d)]
    for _ in range(100):
        off = sum(A[i][j] ** 2 for i in range(d) for j in range(d) if i != j)
        if off < 1e-18:
            break
        for p in range(d):
            for q in range(p + 1, d):
                if abs(A[p][q]) < 1e-300:
                    continue
                theta = (A[q][q] - A[p][p]) / (2 * A[p][q])
                t = (1 if theta >= 0 else -1) / (abs(theta) + (theta * theta + 1) ** 0.5)
                c = 1 / (t * t + 1) ** 0.5
                s = t * c
                for k in range(d):
                    akp, akq = A[k][p], A[k][q]
                    A[k][p], A[k][q] = c * akp - s * akq, s * akp + c * akq
                for k in range(d):
                    apk, aqk = A[p][k], A[q][k]
                    A[p][k], A[q][k] = c * apk - s * aqk, s * apk + c * aqk
    vals = sorted((A[i][i] for i in range(d)), reverse=True)
    return vals[0] > 0 and vals[0] >= 1.5 * vals[1], vals


def gen(n, d, scales, lim=10 ** 4):
    # случайный поворот диагонального облака
    basis = []
    for _ in range(d):
        v = [random.gauss(0, 1) for _ in range(d)]
        for b in basis:
            dot = sum(x * y for x, y in zip(v, b))
            v = [x - dot * y for x, y in zip(v, b)]
        nv = sum(x * x for x in v) ** 0.5
        basis.append([x / nv for x in v])
    X = []
    for _ in range(n):
        coef = [random.gauss(0, s) for s in scales]
        X.append([max(-lim, min(lim, int(sum(coef[k] * basis[k][j] for k in range(d))))) for j in range(d)])
    return X


def tests():
    random.seed(417)
    out = [case([[0, 0], [2, 2], [4, 4], [1, 0], [3, 4]]), case([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [3, 0, 1], [-3, 0, -1]])]
    out.append(case([[0, 5], [10, 5]]))
    out.append(case([[1, 1], [-1, -1], [1, -1], [-1, 1], [5, 5], [-5, -5]]))
    for n, d, sc in ((10, 2, [10, 3]), (100, 3, [100, 50, 10]), (500, 5, [1000, 400, 300, 100, 10]), (3000, 8, [2000, 1200, 900, 500, 400, 100, 50, 10]), (3000, 8, [500] + [100] * 7)):
        while True:
            X = gen(n, d, sc)
            if eig_ok(X)[0]:
                break
        out.append(case(X))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k = d[0], d[1]
    if n > 300:
        return None
    X = [d[2 + i * k:2 + (i + 1) * k] for i in range(n)]
    ok, vals = eig_ok(X)
    return f"{vals[0] / sum(vals):.9f}"
