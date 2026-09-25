import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(86)
    out = [fmt([2, 1, 5, 6, 2, 3]), fmt([2, 4]), fmt([0]), fmt([3, 3, 3]), fmt([1, 2, 3, 4, 5])]
    for n in (8, 30, 200):
        out.append(fmt([random.randint(0, 10) for _ in range(n)]))
    out.append(fmt([random.randint(0, 10 ** 9) for _ in range(40000)]))
    out.append(fmt(list(range(1, 40001))))
    return out


def brute(inp):
    h = list(map(int, inp.split()[1:]))
    n = len(h)
    best = 0
    for i in range(n):
        m = h[i]
        for j in range(i, n):
            m = min(m, h[j])
            best = max(best, m * (j - i + 1))
    return best
