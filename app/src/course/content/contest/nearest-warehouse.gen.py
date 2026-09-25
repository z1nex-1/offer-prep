import random


def rand_city(n, m, wall, wh):
    g = [['#' if random.random() < wall else '.' for _ in range(m)] for _ in range(n)]
    for _ in range(wh):
        g[random.randrange(n)][random.randrange(m)] = 'W'
    if not any('W' in row for row in g):
        g[0][0] = 'W'
    return f'{n} {m}\n' + '\n'.join(''.join(r) for r in g) + '\n'


def tests():
    random.seed(108)
    out = ['3 4\nW..#\n.#..\n...W\n', '1 1\nW\n', '2 3\nW#.\n##.\n']
    for n, m, w, k in ((4, 5, 0.2, 2), (8, 8, 0.3, 3), (12, 15, 0.25, 4)):
        out.append(rand_city(n, m, w, k))
    out.append(rand_city(150, 150, 0.2, 30))
    return out


def brute(inp):
    lines = inp.split()
    n, m = int(lines[0]), int(lines[1])
    g = lines[2:2 + n]
    if n * m > 200:
        return None
    from collections import deque
    whs = [(r, c) for r in range(n) for c in range(m) if g[r][c] == 'W']
    res = []
    for r in range(n):
        row = []
        for c in range(m):
            if g[r][c] == '#':
                row.append('#'); continue
            best = -1
            for s in whs:
                dist = {s: 0}
                q = deque([s])
                while q:
                    x = q.popleft()
                    if x == (r, c):
                        break
                    for nx in ((x[0] + 1, x[1]), (x[0] - 1, x[1]), (x[0], x[1] + 1), (x[0], x[1] - 1)):
                        if 0 <= nx[0] < n and 0 <= nx[1] < m and nx not in dist and g[nx[0]][nx[1]] != '#':
                            dist[nx] = dist[x] + 1
                            q.append(nx)
                if (r, c) in dist and (best == -1 or dist[(r, c)] < best):
                    best = dist[(r, c)]
            row.append(str(best))
        res.append(' '.join(row))
    return '\n'.join(res)
