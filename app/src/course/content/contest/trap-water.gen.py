import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(15)
    out = [fmt([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), fmt([4, 2, 0, 3, 2, 5]), fmt([5]), fmt([1, 2, 3]), fmt([3, 0, 3])]
    for n in (6, 15, 60):
        out.append(fmt([random.randint(0, 8) for _ in range(n)]))
    out.append(fmt([random.randint(0, 10 ** 9) for _ in range(50000)]))
    out.append(fmt(list(range(40000)) + list(range(40000, 0, -1))))
    return out


def brute(inp):
    h = list(map(int, inp.split()[1:]))
    return sum(max(0, min(max(h[:i + 1]), max(h[i:])) - h[i]) for i in range(len(h)))
