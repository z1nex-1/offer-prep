import random


def case(rows):
    return f"{len(rows)}\n" + ''.join(f"{y} {s}\n" for y, s in rows)


def fmt(x):
    return f"{x:.4f}".rstrip('0').rstrip('.') if x else '0'


def noisy(n, pos_rate, sep, digits):
    rows = []
    for _ in range(n):
        y = 1 if random.random() < pos_rate else 0
        s = min(1.0, max(0.0, random.gauss(0.5 + (sep if y else -sep), 0.2)))
        rows.append((y, fmt(round(s, digits))))
    if all(y == rows[0][0] for y, _ in rows):
        rows[0] = (1 - rows[0][0], rows[0][1])
    return rows


def tests():
    random.seed(403)
    out = [case([(1, '0.9'), (1, '0.4'), (0, '0.4'), (0, '0.1')]), case([(0, '0.8'), (1, '0.7'), (1, '0.6'), (0, '0.2'), (1, '0.9')])]
    out.append(case([(1, '0.5'), (0, '0.5')]))
    out.append(case([(0, '0.9'), (1, '0.1')]))
    out.append(case([(1, '0.3'), (1, '0.30'), (0, '0.2'), (0, '0.3000')]))
    out.append(case([(1, '1'), (0, '0'), (0, '0'), (1, '1'), (0, '1')]))
    for n in (8, 30, 200):
        out.append(case(noisy(n, 0.4, 0.1, 1)))
    out.append(case(noisy(1000, 0.3, 0.05, 2)))
    out.append(case(noisy(40000, 0.05, 0.1, 3)))
    out.append(case(noisy(40000, 0.5, 0.02, 2)))
    return out


def brute(inp):
    d = inp.split()
    n = int(d[0])
    rows = [(int(d[1 + 2 * i]), float(d[2 + 2 * i])) for i in range(n)]
    pos = [s for y, s in rows if y]
    neg = [s for y, s in rows if not y]
    good = sum(1 if a > b else 0.5 if a == b else 0 for a in pos for b in neg)
    return f"{good / (len(pos) * len(neg)):.9f}"
