import random


def case(img, ker, s, p):
    H, W, k = len(img), len(img[0]), len(ker)
    return f"{H} {W} {k} {s} {p}\n" + ''.join(' '.join(map(str, r)) + '\n' for r in img + ker)


def rnd(h, w, lim):
    return [[random.randint(-lim, lim) for _ in range(w)] for _ in range(h)]


def tests():
    random.seed(418)
    out = [case([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[1, 0], [0, -1]], 1, 0), case([[1, 2], [3, 4]], [[1, 1, 1], [1, 1, 1], [1, 1, 1]], 1, 1)]
    out.append(case([[5]], [[2]], 1, 0))
    out.append(case([[1, 2, 3, 4, 5]], [[1]], 2, 0))
    out.append(case(rnd(4, 6, 5), rnd(3, 3, 2), 2, 1))
    out.append(case(rnd(1, 1, 9), rnd(3, 3, 9), 1, 1))
    for h, w, k, s, p in ((7, 5, 3, 1, 0), (20, 30, 5, 2, 2), (64, 64, 3, 1, 1), (200, 200, 7, 3, 3), (150, 120, 4, 1, 0)):
        out.append(case(rnd(h, w, 100), rnd(k, k, 100), s, p))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    H, W, k, s, p = d[:5]
    if H * W > 2000:
        return None
    img = [d[5 + i * W:5 + (i + 1) * W] for i in range(H)]
    ker = [d[5 + H * W + i * k:5 + H * W + (i + 1) * k] for i in range(k)]
    get = lambda i, j: img[i - p][j - p] if 0 <= i - p < H and 0 <= j - p < W else 0
    rows = []
    i = 0
    while i + k <= H + 2 * p:
        row = []
        j = 0
        while j + k <= W + 2 * p:
            row.append(sum(get(i + a, j + b) * ker[a][b] for a in range(k) for b in range(k)))
            j += s
        rows.append(row)
        i += s
    return f"{len(rows)} {len(rows[0])}\n" + '\n'.join(' '.join(map(str, r)) for r in rows)
