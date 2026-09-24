import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(43)
    out = [fmt([2, 3, 1, 1, 4]), fmt([3, 2, 1, 0, 4]), fmt([0]), fmt([1, 0]), fmt([0, 1])]
    for n in (6, 15, 60):
        out.append(fmt([random.choice([0, 0, 1, 2, 3]) for _ in range(n)]))
    out.append(fmt([1] * 50000))
    out.append(fmt([random.choice([0, 1, 2, 3, 5]) for _ in range(50000)]))
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    n = len(a)
    ok = [False] * n
    ok[0] = True
    for i in range(n):
        if ok[i]:
            for j in range(i + 1, min(n, i + a[i] + 1)):
                ok[j] = True
    return 'YES' if ok[-1] else 'NO'
