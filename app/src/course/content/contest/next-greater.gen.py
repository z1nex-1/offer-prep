import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(85)
    out = [fmt([2, 1, 2, 4, 3]), fmt([5, 4, 3]), fmt([1]), fmt([3, 3, 3, 4])]
    for n in (8, 40, 300):
        out.append(fmt([random.randint(1, 10) for _ in range(n)]))
    out.append(fmt([random.randint(-10 ** 9, 10 ** 9) for _ in range(40000)]))
    out.append(fmt(list(range(40000, 0, -1))))
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    n = len(a)
    return ' '.join(str(next((j for j in range(i + 1, n) if a[j] > a[i]), -1)) for i in range(n))
