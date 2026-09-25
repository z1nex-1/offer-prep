import random


def rand_maze(n, m, wall):
    g = [['#' if random.random() < wall else '.' for _ in range(m)] for _ in range(n)]
    cells = random.sample([(r, c) for r in range(n) for c in range(m)], 2)
    (a, b), (c, d) = cells
    g[a][b], g[c][d] = 'S', 'F'
    return f'{n} {m}\n' + '\n'.join(''.join(r) for r in g) + '\n'


def tests():
    random.seed(102)
    out = ['3 4\nS..#\n.#..\n...F\n', '1 2\nSF\n', '3 3\nS#.\n##.\n..F\n', '2 3\nS#F\n...\n']
    for n, m, w in ((5, 5, 0.3), (8, 12, 0.35), (20, 20, 0.3)):
        out.append(rand_maze(n, m, w))
    out.append(rand_maze(200, 200, 0.25))
    g = [['.'] * 200 for _ in range(200)]
    for r in range(1, 200, 2):
        for c in range(200):
            g[r][c] = '#'
        g[r][0 if r % 4 == 1 else 199] = '.'
    g[0][0], g[199][199] = 'S', 'F'
    out.append('200 200\n' + '\n'.join(''.join(r) for r in g) + '\n')
    return out


def brute(inp):
    lines = inp.split()
    n, m = int(lines[0]), int(lines[1])
    g = lines[2:2 + n]
    if n * m > 500:
        return None
    INF = 10 ** 9
    dist = {}
    for r in range(n):
        for c in range(m):
            dist[(r, c)] = INF
            if g[r][c] == 'S':
                dist[(r, c)] = 0
            if g[r][c] == 'F':
                f = (r, c)
    changed = True
    while changed:
        changed = False
        for (r, c), d in list(dist.items()):
            if d == INF or g[r][c] == '#':
                continue
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < n and 0 <= nc < m and g[nr][nc] != '#' and dist[(nr, nc)] > d + 1:
                    dist[(nr, nc)] = d + 1
                    changed = True
    return dist[f] if dist[f] < INF else -1
