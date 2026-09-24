import random


def mat(n, m, lo=-9, hi=9):
    return f'{n} {m}\n' + '\n'.join(' '.join(str(random.randint(lo, hi)) for _ in range(m)) for _ in range(n)) + '\n'


def seq(n, m):
    return f'{n} {m}\n' + '\n'.join(' '.join(str(i * m + j + 1) for j in range(m)) for i in range(n)) + '\n'


def tests():
    random.seed(12)
    out = [seq(3, 3), seq(3, 4), seq(1, 1), seq(1, 5), seq(5, 1), seq(2, 2), seq(2, 5), seq(5, 2), seq(4, 4), seq(4, 6), seq(7, 3)]
    for n, m in ((10, 13), (30, 7)):
        out.append(mat(n, m))
    out.append(mat(100, 120, -10**9, 10**9))
    out.append(mat(300, 300, 0, 9))
    out.append(seq(300, 1))
    return out


def brute(inp):
    d = inp.split()
    n, m = int(d[0]), int(d[1])
    a = [[d[2 + i * m + j] for j in range(m)] for i in range(n)]
    seen = [[False] * m for _ in range(n)]
    dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    i = j = k = 0
    res = []
    for _ in range(n * m):
        res.append(a[i][j])
        seen[i][j] = True
        ni, nj = i + dirs[k][0], j + dirs[k][1]
        if not (0 <= ni < n and 0 <= nj < m) or seen[ni][nj]:
            k = (k + 1) % 4
            ni, nj = i + dirs[k][0], j + dirs[k][1]
        i, j = ni, nj
    return ' '.join(res)
