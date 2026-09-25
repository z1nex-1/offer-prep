import random


def rand_graph(n, m, directed=False, wmax=None):
    edges = set()
    while len(edges) < m:
        u, v = random.randint(1, n), random.randint(1, n)
        if u == v:
            continue
        if not directed and (v, u) in edges:
            continue
        edges.add((u, v))
    res = []
    for u, v in edges:
        res.append((u, v, random.randint(1, wmax)) if wmax else (u, v))
    random.shuffle(res)
    return res


def fmt(n, edges, extra=''):
    return f"{n} {len(edges)}\n" + '\n'.join(' '.join(map(str, e)) for e in edges) + '\n' + extra


def bip_graph(n, m):
    side = [random.randint(0, 1) for _ in range(n + 1)]
    edges = set()
    tries = 0
    while len(edges) < m and tries < 50 * m:
        tries += 1
        u, v = random.randint(1, n), random.randint(1, n)
        if side[u] != side[v] and (v, u) not in edges:
            edges.add((u, v))
    return list(edges)


def tests():
    random.seed(104)
    out = [fmt(3, [(1, 2), (2, 3)]), fmt(3, [(1, 2), (2, 3), (3, 1)]), fmt(1, []), fmt(4, [(1, 2), (3, 4)])]
    for n, m in ((6, 6), (10, 12), (12, 10)):
        out.append(fmt(n, rand_graph(n, m)))
        out.append(fmt(n, bip_graph(n, m)))
    out.append(fmt(30000, bip_graph(30000, 40000)))
    e = bip_graph(30000, 40000)
    e.append((1, 2) if (1, 2) not in e and (2, 1) not in e else (3, 4))
    out.append(fmt(30000, e))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    if n > 12:
        return None
    edges = [(d[2 + 2 * i], d[3 + 2 * i]) for i in range(m)]
    for mask in range(1 << n):
        if all(((mask >> (u - 1)) & 1) != ((mask >> (v - 1)) & 1) for u, v in edges):
            return 'YES'
    return 'NO'
