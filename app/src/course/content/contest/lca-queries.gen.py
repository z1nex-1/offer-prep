import random


def fmt(parent, queries):
    n = len(parent) - 1
    return (f'{n}\n' + ' '.join(map(str, parent[2:])) + '\n'
            + f'{len(queries)}\n' + ''.join(f'{u} {v}\n' for u, v in queries))


def relabel(n, par_of):
    # par_of задан для вершин 2..n с par_of[v] < v; перемешиваем номера, оставляя корень 1
    perm = [0, 1] + random.sample(range(2, n + 1), n - 1)
    parent = [0] * (n + 1)
    for v in range(2, n + 1):
        parent[perm[v]] = perm[par_of[v]]
    return parent


def rand_queries(n, q):
    return [(random.randint(1, n), random.randint(1, n)) for _ in range(q)]


def tests():
    random.seed(21)
    out = ['7\n1 1 2 2 3 5\n5\n4 6\n7 4\n7 3\n1 1\n6 7\n',
           '1\n\n2\n1 1\n1 1\n',
           '5\n3 1 5 1\n4\n2 4\n4 5\n2 3\n3 3\n']
    for n, q, shape in ((10, 20, 'rand'), (60, 100, 'rand'), (300, 300, 'chain'), (1000, 1000, 'deep')):
        if shape == 'rand':
            par_of = [0, 0] + [random.randint(1, v - 1) for v in range(2, n + 1)]
        elif shape == 'chain':
            par_of = [0, 0] + [v - 1 for v in range(2, n + 1)]
        else:
            par_of = [0, 0] + [max(1, v - random.randint(1, 3)) for v in range(2, n + 1)]
        out.append(fmt(relabel(n, par_of), rand_queries(n, q)))
    n = 15000
    out.append(fmt(relabel(n, [0, 0] + [random.randint(1, v - 1) for v in range(2, n + 1)]), rand_queries(n, 15000)))
    par_of = [0, 0] + [1 if v == n // 2 + 1 else v - 1 for v in range(2, n + 1)]
    out.append(fmt(relabel(n, par_of), rand_queries(n, 15000)))
    parent = [0, 1] + list(range(1, n))
    ends = [n - k for k in range(10)]
    out.append(fmt(parent, [(random.choice(ends), random.choice(ends)) for _ in range(15000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    parent = [0, 0] + d[1:n]
    q = d[n]
    def anc(v):
        path = [v]
        while v != 1:
            v = parent[v]
            path.append(v)
        return path
    res = []
    for i in range(q):
        u, v = d[n + 1 + 2 * i], d[n + 2 + 2 * i]
        pu, pv = anc(u), anc(v)
        pos = {x: k for k, x in enumerate(pu)}
        for k, x in enumerate(pv):
            if x in pos:
                res.append(pos[x] + k)
                break
    return '\n'.join(map(str, res))
