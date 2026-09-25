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
    random.seed(106)
    out = [fmt(4, [(1, 2, 1), (2, 4, 5), (1, 3, 2), (3, 4, 1)]), fmt(3, [(1, 2, 7)]), fmt(2, [(1, 2, 0)]), fmt(3, [(1, 2, 5), (2, 3, 5), (1, 3, 10)])]
    for n, m in ((5, 6), (10, 15), (30, 60)):
        out.append(fmt(n, rand_graph(n, m, wmax=20)))
    out.append(fmt(20000, rand_graph(20000, 40000, wmax=10 ** 9)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    if n > 40:
        return None
    INF = float('inf')
    dist = [[INF] * (n + 1) for _ in range(n + 1)]
    for v in range(n + 1):
        dist[v][v] = 0
    for i in range(m):
        u, v, w = d[2 + 3 * i:5 + 3 * i]
        dist[u][v] = min(dist[u][v], w)
        dist[v][u] = min(dist[v][u], w)
    for k in range(1, n + 1):
        for i in range(1, n + 1):
            for j in range(1, n + 1):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    r = dist[1][n]
    return r if r < INF else -1
