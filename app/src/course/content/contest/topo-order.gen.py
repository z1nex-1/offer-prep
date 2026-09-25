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


def dag(n, m):
    perm = list(range(1, n + 1))
    random.shuffle(perm)
    pos = {v: i for i, v in enumerate(perm)}
    edges = set()
    tries = 0
    while len(edges) < m and tries < 50 * m + 10:
        tries += 1
        u, v = random.randint(1, n), random.randint(1, n)
        if pos[u] < pos[v]:
            edges.add((u, v))
    return list(edges)


def tests():
    random.seed(105)
    out = [fmt(4, [(2, 1), (3, 1), (1, 4)]), fmt(3, [(1, 2), (2, 3), (3, 1)]), fmt(3, []), fmt(2, [(2, 1)])]
    for n, m in ((5, 4), (6, 7), (7, 8)):
        out.append(fmt(n, dag(n, m)))
    out.append(fmt(6, dag(6, 6) + [(1, 1)] if False else rand_graph(6, 9, directed=True)))
    out.append(fmt(30000, dag(30000, 40000)))
    return out


def brute(inp):
    from itertools import permutations
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    if n > 7:
        return None
    edges = [(d[2 + 2 * i], d[3 + 2 * i]) for i in range(m)]
    for p in permutations(range(1, n + 1)):
        pos = {v: i for i, v in enumerate(p)}
        if all(pos[a] < pos[b] for a, b in edges):
            return ' '.join(map(str, p))
    return -1
