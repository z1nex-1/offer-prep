import random


def fmt(g, qs):
    n, m = len(g), len(g[0])
    return f"{n} {m} {len(qs)}\n" + '\n'.join(' '.join(map(str, r)) for r in g) + '\n' + '\n'.join(' '.join(map(str, t)) for t in qs) + '\n'


def rq(n, m, q):
    res = []
    for _ in range(q):
        x1 = random.randint(1, n)
        y1 = random.randint(1, m)
        res.append((x1, y1, random.randint(x1, n), random.randint(y1, m)))
    return res


def tests():
    random.seed(62)
    out = [fmt([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [(2, 2, 3, 3), (1, 1, 1, 1), (1, 1, 3, 3)]), fmt([[5]], [(1, 1, 1, 1)])]
    for n, m in ((3, 5), (10, 7)):
        g = [[random.randint(-9, 9) for _ in range(m)] for _ in range(n)]
        out.append(fmt(g, rq(n, m, 30)))
    g = [[random.randint(-10 ** 6, 10 ** 6) for _ in range(150)] for _ in range(150)]
    out.append(fmt(g, rq(150, 150, 20000)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m, q = d[0], d[1], d[2]
    g = [d[3 + i * m:3 + (i + 1) * m] for i in range(n)]
    pos = 3 + n * m
    res = []
    for _ in range(q):
        x1, y1, x2, y2 = d[pos:pos + 4]
        pos += 4
        res.append(sum(g[i][j] for i in range(x1 - 1, x2) for j in range(y1 - 1, y2)))
    return '\n'.join(map(str, res))
