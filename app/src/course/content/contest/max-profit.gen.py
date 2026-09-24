import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(11)
    out = [fmt([7, 1, 5, 3, 6, 4]), fmt([7, 6, 4, 3, 1]), fmt([5]), fmt([1, 2]), fmt([3, 3, 3])]
    for n in (8, 20, 100):
        out.append(fmt([random.randint(1, 50) for _ in range(n)]))
    out.append(fmt([random.randint(1, 10 ** 9) for _ in range(50000)]))
    out.append(fmt(list(range(50000, 0, -1))))
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    return max([0] + [a[j] - a[i] for i in range(len(a)) for j in range(i + 1, len(a))])
