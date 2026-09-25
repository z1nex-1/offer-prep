import random


def fmt(v):
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def case(rows, T, lr):
    d = len(rows[0]) - 1
    return f"{len(rows)} {d} {T} {lr}\n" + ''.join(' '.join(map(fmt, r)) + '\n' for r in rows)


def gen(n, d, noise):
    w = [random.uniform(-10, 10) for _ in range(d + 1)]
    rows = []
    for _ in range(n):
        x = [round(random.uniform(-3, 3), 2) for _ in range(d)]
        y = w[0] + sum(a * b for a, b in zip(w[1:], x)) + random.gauss(0, noise)
        rows.append(x + [round(max(-100, min(100, y)))])
    return rows


def tests():
    random.seed(413)
    out = [case([[1, 3], [2, 5], [3, 7]], 1, 0.1), case([[0, 1], [1, 3], [2, 5], [3, 7]], 100, 0.05)]
    out.append(case([[0.5, 2]], 3, 0.5))
    out.append(case([[1, 1, 1], [-1, 1, 0], [0, -2, 4]], 50, 0.1))
    for n, d, T, lr, noise in ((10, 1, 20, 0.05, 1), (50, 2, 200, 0.03, 3), (200, 3, 500, 0.02, 5), (200, 3, 300, 0.05, 10)):
        out.append(case(gen(n, d, noise), T, lr))
    return out


