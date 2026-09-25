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


def tests():
    random.seed(109)
    out = [fmt(4, [(1, 2, 1), (2, 3, 4), (3, 4, 2), (1, 4, 3), (1, 3, 5)]), fmt(1, []), fmt(3, [(1, 2, 5)]), fmt(2, [(1, 2, 3), (1, 2, 1)])]
    for n, m in ((5, 7), (8, 12), (10, 20)):
        out.append(fmt(n, rand_graph(n, m, wmax=15)))
    out.append(fmt(20000, rand_graph(20000, 40000, wmax=10 ** 9)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    if n > 12:
        return None
    edges = [tuple(d[2 + 3 * i:5 + 3 * i]) for i in range(m)]
    INF = float('inf')
    inside = {1}
    total = 0
    while len(inside) < n:
        best = None
        for u, v, w in edges:
            if (u in inside) != (v in inside) and (best is None or w < best[0]):
                best = (w, u if u not in inside else v)
        if best is None:
            return -1
        total += best[0]
        inside.add(best[1])
    return total
