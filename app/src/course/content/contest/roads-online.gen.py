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
    random.seed(107)
    out = [fmt(4, [(1, 2), (3, 4), (2, 1), (1, 3)]), fmt(1, [(1, 1)]), fmt(3, [(1, 2), (2, 3), (1, 3)])]
    for n, m in ((6, 6), (15, 12), (40, 50)):
        out.append(fmt(n, [(random.randint(1, n), random.randint(1, n)) for _ in range(m)]))
    out.append(fmt(30000, [(random.randint(1, 30000), random.randint(1, 30000)) for _ in range(40000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    if n > 50:
        return None
    comp = list(range(n + 1))
    out = []
    for i in range(m):
        a, b = comp[d[2 + 2 * i]], comp[d[3 + 2 * i]]
        if a != b:
            comp = [a if c == b else c for c in comp]
        out.append(len(set(comp[1:])))
    return '\n'.join(map(str, out))
