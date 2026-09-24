import random


def mat(n, m, lo=-9, hi=9):
    return f'{n} {m}\n' + '\n'.join(' '.join(str(random.randint(lo, hi)) for _ in range(m)) for _ in range(n)) + '\n'


def tests():
    random.seed(11)
    out = ['2 2\n1 2\n3 4\n', '2 3\n1 2 3\n4 5 6\n', '1 1\n-5\n', '1 4\n1 2 3 4\n', '4 1\n1\n2\n3\n4\n']
    for n, m in ((3, 3), (3, 5), (6, 2), (40, 30)):
        out.append(mat(n, m))
    out.append(mat(150, 100, -10**9, 10**9))
    out.append(mat(300, 300, 0, 9))
    return out


def brute(inp):
    d = inp.split()
    n, m = int(d[0]), int(d[1])
    a = [[d[2 + i * m + j] for j in range(m)] for i in range(n)]
    return '\n'.join(' '.join(a[n - 1 - j][i] for j in range(n)) for i in range(m))
