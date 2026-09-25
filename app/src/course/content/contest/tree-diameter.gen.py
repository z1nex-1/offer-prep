import random


def make(n, mode, wmax):
    perm = list(range(1, n + 1))
    random.shuffle(perm)
    edges = []
    for k in range(1, n):
        j = k - 1 if mode == 'chain' else 0 if mode == 'star' else random.randrange(max(0, k - 3), k) if mode == 'deep' else random.randrange(k)
        edges.append((perm[k], perm[j], random.randint(1, wmax)))
    random.shuffle(edges)
    return f'{n}\n' + ''.join(f'{u} {v} {w}\n' for u, v, w in edges)


def tests():
    random.seed(66)
    out = ['5\n1 2 3\n2 3 4\n2 4 10\n4 5 1\n', '4\n1 2 1\n1 3 1\n1 4 1\n', '1\n', '2\n2 1 1000000000\n']
    for n, mode, wmax in ((8, 'rand', 10), (30, 'star', 100), (100, 'deep', 5), (1000, 'rand', 10**9),
                          (20000, 'chain', 10**9), (20000, 'rand', 1000), (10000, 'deep', 10**9)):
        out.append(make(n, mode, wmax))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    g = {v: [] for v in range(1, n + 1)}
    for i in range(n - 1):
        u, v, w = d[1 + 3 * i: 4 + 3 * i]
        g[u].append((v, w)); g[v].append((u, w))
    best = 0
    for s in range(1, n + 1):
        dist = {s: 0}
        st = [s]
        while st:
            v = st.pop()
            for u, w in g[v]:
                if u not in dist:
                    dist[u] = dist[v] + w; st.append(u)
        best = max(best, max(dist.values()))
    return best
