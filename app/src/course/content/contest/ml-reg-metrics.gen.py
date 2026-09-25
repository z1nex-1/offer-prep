import random


def f(x):
    s = f"{x:.3f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def case(y, p):
    return f"{len(y)}\n{' '.join(map(f, y))}\n{' '.join(map(f, p))}\n"


def tests():
    random.seed(405)
    out = [case([3, -0.5, 2, 7], [2.5, 0, 2, 8]), case([1, 2, 3], [3, 2, 1])]
    out.append(case([5, 5, 5], [5, 5, 5]))
    out.append(case([5, 5, 5], [4, 5, 6]))
    out.append(case([1.5], [2]))
    out.append(case([0.1, 0.1, 0.1, 0.1], [0.1, 0.1, 0.1, 0.1]))
    for n in (10, 100, 1000):
        y = [round(random.uniform(-100, 100), 3) for _ in range(n)]
        out.append(case(y, [round(v + random.gauss(0, 20), 3) for v in y]))
    y = [round(random.uniform(0, 10000), 2) for _ in range(40000)]
    out.append(case(y, [round(min(10000, max(-10000, v * 0.9 + random.gauss(0, 500))), 2) for v in y]))
    return out


def brute(inp):
    d = inp.split()
    n = int(d[0])
    y = list(map(float, d[1:1 + n]))
    p = list(map(float, d[1 + n:]))
    mse = sum((a - b) ** 2 for a, b in zip(y, p)) / n
    mae = sum(abs(a - b) for a, b in zip(y, p)) / n
    m = sum(y) / n
    tot = sum((a - m) ** 2 for a in y)
    if len(set(y)) == 1:
        r2 = 1.0 if mse == 0 else 0.0
    else:
        r2 = 1 - mse * n / tot
    return f"{mse:.9f} {mae:.9f} {r2:.9f}"
