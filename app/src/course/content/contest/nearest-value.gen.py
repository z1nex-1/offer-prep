import random


def fmt(a, qs):
    return f"{len(a)} {len(qs)}\n{' '.join(map(str, a))}\n{' '.join(map(str, qs))}\n"


def tests():
    random.seed(52)
    out = [fmt([1, 3, 5, 7, 9], [2, 4, 8, 1, 6]), fmt([5], [1, 10]), fmt([1, 1, 4], [3, 2, 0])]
    for n in (8, 60):
        a = sorted(random.randint(-30, 30) for _ in range(n))
        out.append(fmt(a, [random.randint(-40, 40) for _ in range(n)]))
    a = sorted(random.randint(-10 ** 9, 10 ** 9) for _ in range(30000))
    out.append(fmt(a, [random.randint(-10 ** 9, 10 ** 9) for _ in range(30000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, q = d[0], d[1]
    a = d[2:2 + n]
    return '\n'.join(str(min(a, key=lambda v: (abs(v - x), v))) for x in d[2 + n:])
