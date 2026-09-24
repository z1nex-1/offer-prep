import random


def field(n, m, t, p):
    rows = [''.join('#' if random.random() < p else '.' for _ in range(m)) for _ in range(n)]
    return f'{n} {m} {t}\n' + '\n'.join(rows) + '\n'


def tests():
    random.seed(18)
    out = ['3 3 1\n...\n###\n...\n', '5 5 4\n.#...\n..#..\n###..\n.....\n.....\n', '1 1 1\n#\n', '2 2 5\n##\n##\n', '1 5 1\n#####\n',
           '4 4 2\n####\n####\n####\n####\n', '3 3 20\n...\n###\n...\n']
    for n, m, t, p in ((6, 7, 3, 0.4), (10, 10, 10, 0.3), (30, 40, 5, 0.35), (100, 100, 20, 0.3), (100, 100, 7, 0.5)):
        out.append(field(n, m, t, p))
    return out


def brute(inp):
    d = inp.split()
    n, m, t = int(d[0]), int(d[1]), int(d[2])
    alive = {(i, j) for i in range(n) for j in range(m) if d[3 + i][j] == '#'}
    for _ in range(t):
        cnt = {}
        for i, j in alive:
            for a in range(i - 1, i + 2):
                for b in range(j - 1, j + 2):
                    if (a, b) != (i, j) and 0 <= a < n and 0 <= b < m:
                        cnt[(a, b)] = cnt.get((a, b), 0) + 1
        alive = {c for c, k in cnt.items() if k == 3 or (k == 2 and c in alive)}
    return '\n'.join(''.join('#' if (i, j) in alive else '.' for j in range(m)) for i in range(n))
