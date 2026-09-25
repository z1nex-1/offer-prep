import random


def case(d, k, train, queries):
    s = f"{len(train)} {d} {k}\n" + ''.join(' '.join(map(str, p)) + f" {c}\n" for p, c in train)
    return s + f"{len(queries)}\n" + ''.join(' '.join(map(str, x)) + '\n' for x in queries)


def blobs(n, d, classes, spread, lim=1000):
    centers = [[random.randint(-lim // 2, lim // 2) for _ in range(d)] for _ in range(classes)]
    train = []
    for _ in range(n):
        c = random.randrange(classes)
        train.append(([max(-lim, min(lim, int(random.gauss(v, spread)))) for v in centers[c]], c))
    return train


def tests():
    random.seed(407)
    out = [
        case(2, 3, [((0, 0), 0), ((1, 0), 0), ((5, 5), 1), ((6, 5), 1), ((0, 1), 1)], [(0, 0), (5, 6), (3, 3)]),
        case(1, 2, [((0,), 2), ((2,), 1), ((-2,), 0)], [(0,), (1,), (-1,)]),
    ]
    out.append(case(1, 1, [((5,), 3)], [(0,), (5,), (1000,)]))
    out.append(case(2, 4, [((0, 0), 1), ((0, 0), 0), ((0, 0), 1), ((0, 0), 0), ((0, 0), 2)], [(0, 0), (1, 1)]))
    out.append(case(1, 5, [((i,), i % 3) for i in range(5)], [(2,)]))
    for n, d, k, c in ((10, 1, 3, 2), (40, 2, 5, 3), (200, 3, 7, 4), (1000, 4, 15, 10)):
        tr = blobs(n, d, c, 150)
        qs = [[random.randint(-600, 600) for _ in range(d)] for _ in range(min(200, 3 * n))]
        out.append(case(d, k, tr, qs))
    tr = [([random.randint(-3, 3), random.randint(-3, 3)], random.randint(0, 3)) for _ in range(300)]
    out.append(case(2, 10, tr, [[random.randint(-4, 4), random.randint(-4, 4)] for _ in range(200)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, dim, k = d[0], d[1], d[2]
    pos = 3
    tr = []
    for i in range(n):
        tr.append((d[pos:pos + dim], d[pos + dim], i))
        pos += dim + 1
    q = d[pos]
    pos += 1
    res = []
    for _ in range(q):
        x = d[pos:pos + dim]
        pos += dim
        nb = sorted(tr, key=lambda t: (sum((a - b) ** 2 for a, b in zip(t[0], x)), t[2]))[:k]
        cnt = {}
        for _, c, _ in nb:
            cnt[c] = cnt.get(c, 0) + 1
        best = max(cnt.values())
        res.append(min(c for c, v in cnt.items() if v == best))
    return '\n'.join(map(str, res))
