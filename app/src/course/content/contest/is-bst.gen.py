import random


def fmt(nodes):
    # nodes: список (val, l, r) для вершин 1..n
    return f'{len(nodes)}\n' + ''.join(f'{v} {l} {r}\n' for v, l, r in nodes)


def bst_from(values):
    # дерево поиска вставками; возвращает список вершин в случайной нумерации с корнем 1
    idx = {}
    L, R, V = [0], [0], [values[0]]
    for x in values[1:]:
        cur = 0
        while True:
            if x < V[cur]:
                if L[cur]:
                    cur = L[cur]
                else:
                    L[cur] = len(V); break
            else:
                if R[cur]:
                    cur = R[cur]
                else:
                    R[cur] = len(V); break
        V.append(x); L.append(0); R.append(0)
    n = len(V)
    perm = [0] + random.sample(range(1, n), n - 1)
    new = {old: i + 1 for i, old in enumerate(perm)}
    nodes = [None] * n
    for old in range(n):
        nodes[new[old] - 1] = [V[old], new[L[old]] if L[old] else 0, new[R[old]] if R[old] else 0]
    return nodes


def tests():
    random.seed(44)
    out = [fmt([(5, 2, 3), (3, 0, 0), (8, 0, 0)]), fmt([(5, 2, 3), (3, 0, 4), (8, 0, 0), (7, 0, 0)]),
           fmt([(5, 2, 0), (5, 0, 0)]), fmt([(1, 0, 0)]), fmt([(2, 0, 2), (1, 0, 0)])]
    for n in (10, 100, 1000):
        vals = random.sample(range(-10**9, 10**9), n)
        out.append(fmt(bst_from(vals)))
        t = bst_from(vals)
        # портим: меняем значения двух вершин местами — обычно дерево перестаёт быть поисковым
        a, b = random.sample(range(n), 2)
        t[a][0], t[b][0] = t[b][0], t[a][0]
        out.append(fmt(t))
    vals = random.sample(range(-10**9, 10**9), 9000)
    out.append(fmt(bst_from(vals)))
    t = bst_from(vals)
    leaf = next(i for i in range(len(t)) if t[i][1] == 0 and t[i][2] == 0 and i > 0)
    t[leaf][0] += 1 if t[leaf][0] < 10**9 else -1
    out.append(fmt(t))
    chain = sorted(random.sample(range(-10**9, 10**9), 6000))
    out.append(fmt(bst_from(chain)))
    t = bst_from(chain)
    t[-1][0] = chain[0]
    out.append(fmt(t))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    V = [0] + d[1::3]
    L = [0] + d[2::3]
    R = [0] + d[3::3]

    def collect(v):
        res, st = [], [v]
        while st:
            u = st.pop()
            if u:
                res.append(V[u]); st += [L[u], R[u]]
        return res
    for v in range(1, n + 1):
        if any(x >= V[v] for x in collect(L[v])) or any(x <= V[v] for x in collect(R[v])):
            return 'NO'
    return 'YES'
