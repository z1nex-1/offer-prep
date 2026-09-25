import random
from math import exp


def fmt(v):
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def case(rows, T, lr, lam):
    d = len(rows[0]) - 1
    return f"{len(rows)} {d} {T} {lr} {lam}\n" + ''.join(' '.join(map(fmt, r[:-1])) + f" {r[-1]}\n" for r in rows)


def gen(n, d, sharp):
    w = [random.uniform(-1, 1) for _ in range(d + 1)]
    rows = []
    for _ in range(n):
        x = [round(random.uniform(-5, 5), 2) for _ in range(d)]
        z = sharp * (w[0] + sum(a * b for a, b in zip(w[1:], x)))
        rows.append(x + [1 if random.random() < 1 / (1 + exp(-z)) else 0])
    return rows


def tests():
    random.seed(414)
    out = [case([[0, 0], [1, 1]], 1, 0.5, 0), case([[-2, 0], [-1, 0], [1, 1], [2, 1], [0.5, 0]], 100, 0.5, 0.01)]
    out.append(case([[1, 1], [2, 1]], 10, 1, 0))
    out.append(case([[3, 1], [-3, 0]], 300, 1, 0))
    for n, d, T, lr, lam, sharp in ((10, 1, 50, 0.3, 0.0, 2), (60, 2, 200, 0.2, 0.05, 1), (200, 3, 300, 0.1, 0.01, 3), (200, 3, 150, 0.5, 0.2, 0.5)):
        out.append(case(gen(n, d, sharp), T, lr, lam))
    return out
