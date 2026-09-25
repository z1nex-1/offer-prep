import random


def fmt(pts, k):
    return f"{len(pts)} {k}\n" + '\n'.join(f'{x} {y}' for x, y in pts) + '\n'


def tests():
    random.seed(116)
    out = [fmt([(1, 3), (-2, 2)], 1), fmt([(3, 3), (5, -1), (-2, 4)], 2), fmt([(1, 0), (0, 1), (-1, 0), (0, -1)], 3), fmt([(0, 0)], 1)]
    for n in (8, 30, 200):
        pts = [(random.randint(-10, 10), random.randint(-10, 10)) for _ in range(n)]
        out.append(fmt(pts, random.randint(1, n)))
    pts = [(random.randint(-10 ** 4, 10 ** 4), random.randint(-10 ** 4, 10 ** 4)) for _ in range(40000)]
    out.append(fmt(pts, 50))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k = d[0], d[1]
    pts = [(d[2 + 2 * i], d[3 + 2 * i]) for i in range(n)]
    pts.sort(key=lambda p: (p[0] ** 2 + p[1] ** 2, p[0], p[1]))
    return '\n'.join(f'{x} {y}' for x, y in pts[:k])
