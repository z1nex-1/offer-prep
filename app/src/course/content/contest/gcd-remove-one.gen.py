import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(140)
    out = [fmt([12, 15, 18]), fmt([7, 1]), fmt([6, 10, 15]), fmt([4, 4, 4]), fmt([5, 10, 3, 20])]
    for n in (6, 20, 100):
        g = random.randint(1, 20)
        out.append(fmt([g * random.randint(1, 30) for _ in range(n - 1)] + [random.randint(1, 600)]))
    g = 10 ** 9 + 7
    a = [g * random.randint(1, 10 ** 8) for _ in range(39999)] + [999999999999999989]
    random.shuffle(a)
    out.append(fmt(a))
    return out


def brute(inp):
    from math import gcd
    from functools import reduce
    d = list(map(int, inp.split()))
    n, a = d[0], d[1:]
    if n > 300:
        return None
    return max(reduce(gcd, a[:i] + a[i + 1:]) for i in range(n))
