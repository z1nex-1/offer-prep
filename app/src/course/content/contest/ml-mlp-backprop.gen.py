import math
import random


def fmt(v):
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def case(X, Y, W1, b1, w2, b2, T, lr):
    n, d, h = len(X), len(X[0]), len(b1)
    s = f"{n} {d} {h} {T} {lr}\n" + ''.join(' '.join(map(fmt, x)) + f" {fmt(y)}\n" for x, y in zip(X, Y))
    s += ''.join(' '.join(map(fmt, r)) + '\n' for r in W1)
    return s + ' '.join(map(fmt, b1)) + '\n' + ' '.join(map(fmt, w2)) + '\n' + fmt(b2) + '\n'


def rnd_case(n, d, h, T, lr, f):
    X = [[round(random.uniform(-3, 3), 2) for _ in range(d)] for _ in range(n)]
    Y = [round(max(-3, min(3, f(x) + random.gauss(0, 0.1))), 2) for x in X]
    W1 = [[round(random.uniform(-1, 1), 2) for _ in range(d)] for _ in range(h)]
    b1 = [round(random.uniform(-1, 1), 2) for _ in range(h)]
    w2 = [round(random.uniform(-1, 1), 2) for _ in range(h)]
    return case(X, Y, W1, b1, w2, round(random.uniform(-1, 1), 2), T, lr)


def tests():
    random.seed(420)
    out = [case([[1]], [1], [[0.5]], [0], [1], 0, 1, 0.1), case([[0, 1], [1, 0], [1, 1]], [1, 1, 0], [[1, -1], [-1, 1]], [0, 0], [1, 1], 0, 5, 0.5)]
    out.append(case([[2]], [0], [[0]], [0], [0], 0, 3, 1))
    for n, d, h, T, lr, f in ((5, 1, 2, 10, 0.3, lambda x: math.sin(x[0])), (30, 2, 4, 50, 0.2, lambda x: x[0] * x[1] / 3), (100, 4, 8, 100, 0.1, lambda x: math.tanh(sum(x) / 2)), (100, 3, 6, 80, 0.5, lambda x: abs(x[0]) - 1)):
        out.append(rnd_case(n, d, h, T, lr, f))
    return out
