import random


def fmt(a, k):
    return f"{len(a)} {k}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(133)
    out = [fmt([1, 2, 3, 4, 5], 3), fmt([-3, 3, 6, -6], 6), fmt([5], 1), fmt([2, 2, 2, 2], 4), fmt([7, -2, 4], 5)]
    for n, k in ((10, 4), (50, 7), (200, 1)):
        out.append(fmt([random.randint(-30, 30) for _ in range(n)], k))
    out.append(fmt([random.randint(-10 ** 9, 10 ** 9) for _ in range(40000)], 1000))
    out.append(fmt([random.randint(-10 ** 9, 10 ** 9) for _ in range(40000)], 10 ** 9))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    if n > 300:
        return None
    return sum(1 for i in range(n) for j in range(i + 1, n) if (a[i] + a[j]) % k == 0)
