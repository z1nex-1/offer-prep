import random


def run(pts, centers, T):
    k = len(centers)
    centers = [tuple(map(float, c)) for c in centers]
    margin = float('inf')

    def assign(p):
        nonlocal margin
        d = sorted(((p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2, j) for j, c in enumerate(centers))
        if k > 1 and d[0][1] > d[1][1] and d[1][0] - d[0][0] < 1e-6 * max(1, d[0][0]):
            margin = 0
        if k > 1 and d[1][0] != d[0][0]:
            margin = min(margin, d[1][0] - d[0][0])
        return d[0][1] if k == 1 or d[1][0] != d[0][0] else min(d[0][1], d[1][1])

    for _ in range(T):
        groups = [[] for _ in range(k)]
        for p in pts:
            groups[assign(p)].append(p)
        centers = [(sum(x for x, _ in g) / len(g), sum(y for _, y in g) / len(g)) if g else centers[j] for j, g in enumerate(groups)]
    inertia = 0.0
    for p in pts:
        j = assign(p)
        inertia += (p[0] - centers[j][0]) ** 2 + (p[1] - centers[j][1]) ** 2
    return centers, inertia, margin


def case(pts, centers, T):
    return f"{len(pts)} {len(centers)} {T}\n" + ''.join(f"{x} {y}\n" for x, y in pts + centers)


def blobs(n, m, spread, lim=10000):
    cs = [(random.randint(-lim // 2, lim // 2), random.randint(-lim // 2, lim // 2)) for _ in range(m)]
    pts = []
    for _ in range(n):
        cx, cy = random.choice(cs)
        pts.append((max(-lim, min(lim, int(random.gauss(cx, spread)))), max(-lim, min(lim, int(random.gauss(cy, spread))))))
    return pts


def good(pts, centers, T):
    _, _, m = run(pts, centers, T)
    return m > 1e-3


def tests():
    random.seed(410)
    out = [case([(0, 0), (0, 2), (10, 0), (10, 2), (5, 1)], [(0, 1), (1, 1)], 1), case([(1, 1), (2, 1), (8, 8), (9, 8), (9, 9)], [(0, 0), (5, 5), (100, 100)], 3)]
    out.append(case([(3, 4)], [(0, 0)], 2))
    out.append(case([(0, 0), (4, 0)], [(2, 0), (2, 5)], 1))
    for n, m, k, T, sp in ((10, 2, 2, 2, 5), (50, 3, 3, 5, 300), (300, 5, 4, 10, 800), (2000, 8, 8, 15, 900), (3000, 10, 10, 20, 400)):
        while True:
            pts = blobs(n, m, sp)
            centers = random.sample(pts, k)
            if len(set(centers)) == k and good(pts, centers, T):
                break
        out.append(case(pts, centers, T))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, T = d[0], d[1], d[2]
    pts = [(d[3 + 2 * i], d[4 + 2 * i]) for i in range(n)]
    cs = [(d[3 + 2 * (n + j)], d[4 + 2 * (n + j)]) for j in range(k)]
    if n > 400:
        return None
    centers, inertia, _ = run(pts, cs, T)
    return '\n'.join(f"{x:.9f} {y:.9f}" for x, y in centers) + f"\n{inertia:.6f}"
