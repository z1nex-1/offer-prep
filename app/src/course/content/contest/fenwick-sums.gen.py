import random


def case(n, q, lim, upd=0.5):
    a = [random.randint(-lim, lim) for _ in range(n)]
    lines = [f'{n} {q}', ' '.join(map(str, a))]
    has_query = False
    for k in range(q):
        if random.random() < upd and not (k == q - 1 and not has_query):
            lines.append(f'1 {random.randint(1, n)} {random.randint(-lim, lim)}')
        else:
            l = random.randint(1, n)
            r = random.randint(l, n)
            lines.append(f'2 {l} {r}')
            has_query = True
    return '\n'.join(lines) + '\n'


def tests():
    random.seed(7)
    out = ['5 6\n1 2 3 4 5\n2 1 5\n2 2 4\n1 3 10\n2 1 3\n1 3 -1\n2 3 3\n',
           '1 3\n7\n2 1 1\n1 1 -1000000000\n2 1 1\n',
           '4 5\n1 1 1 1\n1 2 5\n1 2 5\n2 1 4\n1 4 0\n2 1 4\n']
    for n, q, lim in ((5, 20, 10), (30, 60, 100), (300, 500, 10 ** 9), (1000, 2000, 5)):
        out.append(case(n, q, lim))
    out.append(case(4000, 4000, 10 ** 9))
    out.append(case(4000, 4000, 10 ** 6, upd=0.1))
    n, q = 50000, 40000
    lines = [f'{n} {q}', ' '.join(random.choice('01') for _ in range(n))]
    lines += [f'2 {random.randint(1, 9)} {n - random.randint(0, 9)}' if k % 2 else f'1 {random.randint(1, n)} {random.randint(0, 9)}' for k in range(q)]
    out.append('\n'.join(lines) + '\n')
    return out


def brute(inp):
    d = inp.split()
    n, q = int(d[0]), int(d[1])
    a = [0] + [int(x) for x in d[2:2 + n]]
    res = []
    p = 2 + n
    for _ in range(q):
        k, u, v = d[p], int(d[p + 1]), int(d[p + 2])
        p += 3
        if k == '1':
            a[u] = v
        else:
            res.append(sum(a[u:v + 1]))
    return '\n'.join(map(str, res))
