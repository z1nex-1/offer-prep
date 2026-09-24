import random


def mat(n, m, lo, hi):
    return f'{n} {m}\n' + '\n'.join(' '.join(str(random.randint(lo, hi)) for _ in range(m)) for _ in range(n)) + '\n'


def tests():
    random.seed(15)
    out = ['3 3\n1 2 3\n4 5 6\n7 8 9\n', '2 2\n1 1\n1 1\n', '1 1\n5\n', '1 3\n3 1 2\n', '3 1\n3\n1\n2\n', '2 3\n9 10 11\n1 2 3\n', '2 2\n1 2\n2 1\n']
    for n, m, k in ((3, 4, 3), (5, 5, 2), (8, 6, 10), (20, 20, 1)):
        out.append(mat(n, m, 0, k))
    out.append(mat(200, 200, -10**9, 10**9))
    out.append(mat(300, 300, 0, 3))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    a = [d[2 + i * m:2 + (i + 1) * m] for i in range(n)]
    cnt = 0
    for i in range(n):
        for j in range(m):
            if all(a[i][j] <= a[i][t] for t in range(m)) and all(a[i][j] >= a[s][j] for s in range(n)):
                cnt += 1
    return str(cnt)
