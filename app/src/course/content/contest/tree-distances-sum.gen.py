import random


def fmt(n, edges):
    return f'{n}\n' + ''.join(f'{a} {b}\n' for a, b in edges)


def shuffled(n, par_of):
    perm = [0] + random.sample(range(1, n + 1), n)
    edges = [(perm[v], perm[par_of[v]]) if random.random() < 0.5 else (perm[par_of[v]], perm[v]) for v in range(2, n + 1)]
    random.shuffle(edges)
    return fmt(n, edges)


def tests():
    random.seed(33)
    out = ['5\n1 2\n1 3\n3 4\n3 5\n',
           '1\n',
           '2\n2 1\n',
           '4\n1 2\n2 3\n3 4\n',
           '6\n4 1\n4 2\n4 3\n4 5\n4 6\n']
    for n in (8, 30, 200, 1000):
        out.append(shuffled(n, [0, 0] + [random.randint(1, v - 1) for v in range(2, n + 1)]))
    n = 15000
    out.append(shuffled(n, [0, 0] + [random.randint(1, v - 1) for v in range(2, n + 1)]))
    n = 12000
    out.append(shuffled(n, [0, 0] + [v - 1 for v in range(2, n + 1)]))
    n = 12000
    out.append(shuffled(n, [0, 0] + [max(1, v - random.randint(1, 4)) for v in range(2, n + 1)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    adj = [[] for _ in range(n + 1)]
    for i in range(n - 1):
        a, b = d[1 + 2 * i], d[2 + 2 * i]
        adj[a].append(b)
        adj[b].append(a)
    res = []
    for s in range(1, n + 1):
        dist = [-1] * (n + 1)
        dist[s] = 0
        queue = [s]
        for v in queue:
            for c in adj[v]:
                if dist[c] < 0:
                    dist[c] = dist[v] + 1
                    queue.append(c)
        res.append(sum(dist[1:]))
    return ' '.join(map(str, res))
