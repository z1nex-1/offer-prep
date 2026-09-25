import random


def fmt(g):
    return f"{len(g)} {len(g[0])}\n" + '\n'.join(' '.join(map(str, r)) for r in g) + '\n'


def tests():
    random.seed(128)
    out = [fmt([[9, 9, 9, 9, 9], [3, 0, 0, 0, 0], [9, 9, 9, 9, 9], [6, 6, 6, 6, 8], [9, 9, 9, 9, 9]]), fmt([[5]]), fmt([[1, 1], [1, 1]]), fmt([[-1, -2, -3]])]
    for n, m in ((3, 4), (5, 5), (6, 7)):
        out.append(fmt([[random.randint(-3, 3) for _ in range(m)] for _ in range(n)]))
    out.append(fmt([[random.randint(-10 ** 4, 10 ** 4) for _ in range(200)] for _ in range(200)]))
    return out


def brute(inp):
    from itertools import combinations
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    if n + m > 14:
        return None
    a = [d[2 + i * m:2 + (i + 1) * m] for i in range(n)]
    best = None
    steps = n + m - 2
    for downs in combinations(range(steps), n - 1):
        path = ['R'] * steps
        for k in downs:
            path[k] = 'D'
        i = j = 0
        s = a[0][0]
        for ch in path:
            if ch == 'D':
                i += 1
            else:
                j += 1
            s += a[i][j]
        cand = (-s, ''.join(path))
        if best is None or cand < best:
            best = cand
    return f'{-best[0]}\n{best[1]}'
