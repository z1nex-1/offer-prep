import random


def fmt(a, b):
    return f"{len(a)}\n{' '.join(map(str, a))}\n{len(b)}\n{' '.join(map(str, b))}\n"


def tests():
    random.seed(14)
    out = [fmt([1, 3, 5], [2, 3, 4, 10]), fmt([], [1, 2]), fmt([5], []), fmt([], []), fmt([1, 1], [1])]
    for n, m in ((5, 7), (30, 1), (100, 100)):
        out.append(fmt(sorted(random.randint(-50, 50) for _ in range(n)), sorted(random.randint(-50, 50) for _ in range(m))))
    out.append(fmt(sorted(random.randint(-10 ** 9, 10 ** 9) for _ in range(20000)), sorted(random.randint(-10 ** 9, 10 ** 9) for _ in range(20000))))
    return out


def brute(inp):
    lines = inp.split('\n')
    return ' '.join(map(str, sorted(list(map(int, lines[1].split())) + list(map(int, lines[3].split())))))
