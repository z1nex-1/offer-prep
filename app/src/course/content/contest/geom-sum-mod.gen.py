import random


def fmt(qs):
    return f'{len(qs)}\n' + ''.join(f'{a} {n} {m}\n' for a, n, m in qs)


def tests():
    random.seed(5)
    out = [fmt([(2, 3, 100), (3, 4, 7)]), fmt([(10, 5, 1000000000), (0, 0, 5), (0, 1, 5), (0, 10**18, 7)]),
           fmt([(1, 10**18, 10**9), (1, 7, 1), (5, 10**18, 1)]),
           fmt([(a, n, m) for a in range(4) for n in range(6) for m in (1, 2, 6)])]
    for _ in range(3):
        out.append(fmt([(random.randint(0, 20), random.randint(0, 60), random.randint(1, 100)) for _ in range(200)]))
    out.append(fmt([(random.randint(0, 10**9), random.randint(0, 10**18), random.randint(1, 10**9)) for _ in range(1000)]))
    out.append(fmt([(random.randint(2, 10**9), 10**18 - random.randint(0, 5), random.choice([2 ** 29, 10**9, 999999937, 6 ** 11])) for _ in range(1000)]))
    out.append(fmt([(10**9, 2 ** 59 - 1, 10**9 - 1) for _ in range(1000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    res = []
    for i in range(d[0]):
        a, n, m = d[1 + 3 * i: 4 + 3 * i]
        if n == 0:
            res.append(0)
        elif a == 0:
            res.append(1 % m)
        elif a == 1:
            res.append(n % m)
        else:
            res.append((pow(a, n, m * (a - 1)) - 1) // (a - 1) % m)
    return '\n'.join(map(str, res))
