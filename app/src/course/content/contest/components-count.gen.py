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
    random.seed(101)
    out = [fmt(6, [(1, 2), (2, 3), (4, 5)]), fmt(1, []), fmt(3, [(1, 1), (2, 3), (3, 2)]), fmt(4, [])]
    for n, m in ((8, 5), (20, 15), (60, 40)):
        out.append(fmt(n, rand_graph(n, m)))
    out.append(fmt(30000, rand_graph(30000, 25000)))
    chain = [(i, i + 1) for i in range(1, 30000)]
    out.append(fmt(30000, chain))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    parent = list(range(n + 1))
    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x
    for i in range(m):
        a, b = find(d[2 + 2 * i]), find(d[3 + 2 * i])
        parent[a] = b
    roots = {}
    for v in range(1, n + 1):
        r = find(v)
        roots[r] = roots.get(r, 0) + 1
    return f'{len(roots)} {max(roots.values())}'
