import random
from math import exp


def case(y, p):
    return f"{len(y)}\n{' '.join(map(str, y))}\n{' '.join(f'{q:.6f}'.rstrip('0').rstrip('.') if q not in (0, 1) else str(int(q)) for q in p)}\n"


def model(y, sharp):
    out = []
    for t in y:
        z = random.gauss(sharp if t else -sharp, 1.5)
        out.append(round(1 / (1 + exp(-z)), 6))
    return out


def tests():
    random.seed(402)
    out = [case([1, 0, 1, 0], [0.9, 0.2, 0.6, 0.4]), case([1, 1, 0], [1, 0.5, 0])]
    out.append(case([0, 0, 0], [0.1, 0.2, 0.3]))
    out.append(case([1], [0]))
    out.append(case([1, 0], [0.5, 0.5]))
    for n in (10, 100, 1000):
        y = [random.randint(0, 1) for _ in range(n)]
        out.append(case(y, model(y, 1.0)))
    n = 50000
    y = [1 if random.random() < 0.1 else 0 for _ in range(n)]
    p = model(y, 2.0)
    for i in random.sample(range(n), 20):
        p[i] = float(1 - y[i])
    out.append(case(y, p))
    return out


def brute(inp):
    from math import log
    d = inp.split()
    n = int(d[0])
    y = list(map(int, d[1:1 + n]))
    p = list(map(float, d[1 + n:]))
    cl = lambda q: min(max(q, 1e-15), 1 - 1e-15)
    ll = -sum(t * log(cl(q)) + (1 - t) * log(1 - cl(q)) for t, q in zip(y, p)) / n
    c = cl(sum(y) / n)
    base = -sum(t * log(c) + (1 - t) * log(1 - c) for t in y) / n
    return f"{ll:.9f} {base:.9f}"
