import random


def fmt(a, qs):
    return f"{len(a)}\n{' '.join(map(str, a))}\n{len(qs)}\n{' '.join(map(str, qs))}\n"


def tests():
    random.seed(51)
    out = [fmt([1, 2, 2, 2, 3, 5], [2, 4, 5, 0]), fmt([7], [7, 8]), fmt([1, 1, 1], [1])]
    for n in (10, 100):
        a = sorted(random.randint(-10, 10) for _ in range(n))
        out.append(fmt(a, [random.randint(-12, 12) for _ in range(n)]))
    a = sorted(random.randint(-1000, 1000) for _ in range(30000))
    out.append(fmt(a, [random.randint(-1100, 1100) for _ in range(30000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    a = d[1:1 + n]
    return ' '.join(str(a.count(x)) for x in d[2 + n:])
