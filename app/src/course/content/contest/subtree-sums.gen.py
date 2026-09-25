import random


def make_edges(n, mode):
    perm = list(range(2, n + 1))
    random.shuffle(perm)
    perm = [1] + perm
    edges = []
    for k in range(1, n):
        j = k - 1 if mode == 'chain' else 0 if mode == 'star' else random.randrange(max(0, k - 5), k) if mode == 'deep' else random.randrange(k)
        u, v = perm[k], perm[j]
        edges.append((u, v) if random.random() < 0.5 else (v, u))
    random.shuffle(edges)
    return edges


def fmt(a, edges):
    return f'{len(a)}\n{" ".join(map(str, a))}\n' + ''.join(f'{u} {v}\n' for u, v in edges)


def tests():
    random.seed(55)
    out = [fmt([1, 2, 3, 4, 5], [(1, 2), (1, 3), (3, 4), (3, 5)]), fmt([5, -2, 7], [(3, 2), (2, 1)]), fmt([42], [])]
    for n, mode, lim in ((10, 'rand', 10), (50, 'chain', 100), (300, 'deep', 10**9), (2000, 'rand', 10**9),
                         (20000, 'chain', 1000), (15000, 'rand', 1000), (5000, 'star', 10**9)):
        a = [random.randint(-lim, lim) for _ in range(n)]
        out.append(fmt(a, make_edges(n, mode)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    a = d[1:n + 1]
    e = d[n + 1:]
    g = {v: [] for v in range(1, n + 1)}
    for i in range(0, len(e), 2):
        g[e[i]].append(e[i + 1]); g[e[i + 1]].append(e[i])
    # для каждой вершины: её поддерево — вершины, путь от которых к корню проходит через неё
    par = {1: 0}
    st = [1]
    while st:
        v = st.pop()
        for u in g[v]:
            if u not in par:
                par[u] = v; st.append(u)
    res = [0] * (n + 1)
    for v in range(1, n + 1):
        u = v
        while u:
            res[u] += a[v - 1]
            u = par[u]
    return ' '.join(map(str, res[1:]))
