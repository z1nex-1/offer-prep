import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(37)
    out = [fmt([2, 4, 1, 3, 5]), fmt([5, 4, 3, 2, 1]), fmt([1]), fmt([3, 3, 3]), fmt([1, 2, 3])]
    for n in (8, 40, 300):
        out.append(fmt([random.randint(-20, 20) for _ in range(n)]))
    out.append(fmt([random.randint(-10 ** 9, 10 ** 9) for _ in range(30000)]))
    out.append(fmt(list(range(30000, 0, -1))))
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    return sum(1 for i in range(len(a)) for j in range(i + 1, len(a)) if a[i] > a[j])
