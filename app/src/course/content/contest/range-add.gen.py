import random


def fmt(n, ops):
    return f"{n} {len(ops)}\n" + '\n'.join(f'{l} {r} {v}' for l, r, v in ops) + '\n'


def rops(n, q, vmax):
    res = []
    for _ in range(q):
        l = random.randint(1, n)
        res.append((l, random.randint(l, n), random.randint(-vmax, vmax)))
    return res


def tests():
    random.seed(63)
    out = [fmt(5, [(1, 3, 2), (2, 5, 1)]), fmt(1, [(1, 1, -7)]), fmt(3, [(1, 3, 5), (1, 3, -5)])]
    for n in (8, 60):
        out.append(fmt(n, rops(n, n, 10)))
    out.append(fmt(20000, rops(20000, 20000, 10 ** 9)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, q = d[0], d[1]
    a = [0] * n
    for i in range(q):
        l, r, v = d[2 + 3 * i:5 + 3 * i]
        for j in range(l - 1, r):
            a[j] += v
    return ' '.join(map(str, a))
