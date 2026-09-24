import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(45)
    out = [fmt([3, 5, 1, 7, 9, 0, 9, -3, 10]), fmt([-10, -10, 1, 3, 2]), fmt([-1, -2, -3, -4]), fmt([0, 0, 0]), fmt([1, 2, 3])]
    for n in (5, 12, 100):
        out.append(fmt([random.randint(-20, 20) for _ in range(n)]))
    out.append(fmt([random.randint(-10 ** 6, 10 ** 6) for _ in range(50000)]))
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    n = len(a)
    if n > 60:
        a = sorted(a)
        a = a[:5] + a[-5:]
        n = len(a)
    return max(a[i] * a[j] * a[k] for i in range(n) for j in range(i + 1, n) for k in range(j + 1, n))
