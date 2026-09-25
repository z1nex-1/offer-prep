import random


def fmt(a, b, k):
    return f"{len(a)} {len(b)} {k}\n{' '.join(map(str, a))}\n{' '.join(map(str, b))}\n"


def tests():
    random.seed(117)
    out = [fmt([1, 7, 11], [2, 4, 6], 3), fmt([1, 1, 2], [1, 2, 3], 2), fmt([5], [5], 1), fmt([1, 2], [3], 2)]
    for n, m in ((4, 5), (10, 8), (20, 20)):
        a = sorted(random.randint(-20, 20) for _ in range(n))
        b = sorted(random.randint(-20, 20) for _ in range(m))
        out.append(fmt(a, b, random.randint(1, n * m)))
    a = sorted(random.randint(-10 ** 9, 10 ** 9) for _ in range(30000))
    b = sorted(random.randint(-10 ** 9, 10 ** 9) for _ in range(30000))
    out.append(fmt(a, b, 30000))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m, k = d[0], d[1], d[2]
    if n * m > 10000:
        return None
    a, b = d[3:3 + n], d[3 + n:]
    return ' '.join(map(str, sorted(x + y for x in a for y in b)[:k]))
