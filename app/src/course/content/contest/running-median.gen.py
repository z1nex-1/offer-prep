import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(112)
    out = [fmt([5, 15, 1, 3]), fmt([7]), fmt([2, 2, 2]), fmt([-1, -2, -3, -4])]
    for n in (8, 30, 200):
        out.append(fmt([random.randint(-20, 20) for _ in range(n)]))
    out.append(fmt([random.randint(-10 ** 9, 10 ** 9) for _ in range(15000)]))
    out.append(fmt(list(range(15000, 0, -1))))
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    if len(a) > 300:
        return None
    res = []
    for i in range(len(a)):
        s = sorted(a[:i + 1])
        res.append(str(s[(len(s) - 1) // 2]))
    return '\n'.join(res)
