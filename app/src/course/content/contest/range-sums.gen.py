import random


def fmt(a, qs):
    return f"{len(a)} {len(qs)}\n{' '.join(map(str, a))}\n" + '\n'.join(f'{l} {r}' for l, r in qs) + '\n'


def rq(n, q):
    res = []
    for _ in range(q):
        l = random.randint(1, n)
        res.append((l, random.randint(l, n)))
    return res


def tests():
    random.seed(61)
    out = [fmt([1, 2, 3, 4, 5], [(1, 5), (2, 4), (3, 3)]), fmt([-5], [(1, 1)])]
    for n in (10, 100):
        out.append(fmt([random.randint(-50, 50) for _ in range(n)], rq(n, n)))
    n = 30000
    out.append(fmt([random.randint(-10 ** 9, 10 ** 9) for _ in range(n)], rq(n, n)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, q = d[0], d[1]
    a = d[2:2 + n]
    res = []
    for i in range(q):
        l, r = d[2 + n + 2 * i], d[3 + n + 2 * i]
        res.append(sum(a[l - 1:r]))
    return '\n'.join(map(str, res))
