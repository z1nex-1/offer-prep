import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(12)
    out = [fmt([1, 1, 0, 1]), fmt([1, 1, 1]), fmt([0, 0]), fmt([1]), fmt([0]), fmt([1, 0, 0, 1]), fmt([0, 1, 1, 0, 1, 1, 1, 0, 1])]
    for n in (5, 10, 30, 200):
        out.append(fmt([random.choice([0, 1, 1, 1]) for _ in range(n)]))
    out.append(fmt([1] * 50000))
    out.append(fmt([random.choice([0, 1, 1, 1, 1]) for _ in range(50000)]))
    return out


def brute(inp):
    a = inp.split()[1:]
    best = 0
    for i in range(len(a)):
        s = ''.join(a[:i] + a[i + 1:])
        best = max([best] + [len(t) for t in s.split('0')])
    return best
