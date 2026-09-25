import random


def case(y, p):
    return f"{len(y)}\n{' '.join(map(str, y))}\n{' '.join(map(str, p))}\n"


def tests():
    random.seed(401)
    out = [case([1, 0, 1, 1, 0, 0, 1, 0], [1, 1, 0, 1, 0, 0, 1, 0]), case([0, 0, 1], [0, 0, 0])]
    out.append(case([0, 0, 0], [0, 1, 0]))
    out.append(case([1, 1], [1, 1]))
    out.append(case([0], [0]))
    out.append(case([1, 0, 1], [0, 1, 0]))
    for n in (10, 50, 300):
        y = [random.randint(0, 1) for _ in range(n)]
        out.append(case(y, [t if random.random() < 0.7 else 1 - t for t in y]))
    n = 100000
    y = [1 if random.random() < 0.02 else 0 for _ in range(n)]
    out.append(case(y, [1 if random.random() < 0.03 else 0 for _ in range(n)]))
    return out


def brute(inp):
    d = inp.split()
    n = int(d[0])
    y = list(map(int, d[1:1 + n]))
    p = list(map(int, d[1 + n:]))
    tp = sum(a and b for a, b in zip(y, p))
    pp = sum(p)
    ap = sum(y)
    prec = tp / pp if pp else 0.0
    rec = tp / ap if ap else 0.0
    f1 = 2 * prec * rec / (prec + rec) if prec + rec else 0.0
    return f"{prec:.9f} {rec:.9f} {f1:.9f}"
