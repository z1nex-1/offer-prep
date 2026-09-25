import random
import math


def fmt(pts):
    return f"{len(pts)}\n" + '\n'.join(f'{x} {y}' for x, y in pts) + '\n'


def star(n, r):
    pts = set()
    while len(pts) < n:
        pts.add((random.randint(-r, r), random.randint(-r, r)))
    pts = sorted(pts, key=lambda p: (math.atan2(p[1] - 0.5, p[0] - 0.5), p[0] * p[0] + p[1] * p[1]))
    return pts


def tests():
    random.seed(139)
    out = [fmt([(0, 0), (4, 0), (4, 3)]), fmt([(0, 0), (0, 2), (2, 2), (2, 0)]), fmt([(0, 0), (1, 0), (0, 1)]),
           fmt([(0, 0), (4, 0), (4, 4), (2, 1), (0, 4)])]
    for n in (5, 8, 12):
        out.append(fmt(star(n, 20)))
    out.append(fmt([(-10 ** 9, -10 ** 9), (10 ** 9, -10 ** 9), (10 ** 9, 10 ** 9), (-10 ** 9, 10 ** 9 - 1)]))
    big = star(30000, 10 ** 9)
    out.append(fmt(big))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    pts = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(n)]
    s = 0
    for i in range(n):
        (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % n]
        s += (x2 - x1) * (y1 + y2)
    s = abs(s)
    return f"{s // 2}.{5 if s % 2 else 0}"
