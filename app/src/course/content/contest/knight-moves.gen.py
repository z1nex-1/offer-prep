import random


def tests():
    random.seed(103)
    out = ['8\n1 1 8 8\n', '1\n1 1 1 1\n', '3\n1 1 2 2\n', '2\n1 1 2 2\n', '8\n1 1 1 2\n']
    for n in (4, 5, 10, 30):
        out.append(f'{n}\n{random.randint(1, n)} {random.randint(1, n)} {random.randint(1, n)} {random.randint(1, n)}\n')
    out.append('300\n1 1 300 300\n')
    out.append('300\n150 150 1 300\n')
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, x1, y1, x2, y2 = d
    if n > 30:
        return None
    INF = 10 ** 9
    dist = {(x, y): INF for x in range(1, n + 1) for y in range(1, n + 1)}
    dist[(x1, y1)] = 0
    for _ in range(n * n):
        for (x, y), dd in list(dist.items()):
            if dd == INF:
                continue
            for dx, dy in ((1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1)):
                k = (x + dx, y + dy)
                if k in dist and dist[k] > dd + 1:
                    dist[k] = dd + 1
    r = dist[(x2, y2)]
    return r if r < INF else -1
