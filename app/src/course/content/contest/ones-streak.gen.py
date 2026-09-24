import random


def fmt(a):
    return f'{len(a)}\n{" ".join(map(str, a))}\n'


def tests():
    random.seed(1)
    out = [fmt([1, 0, 1, 1, 0]), fmt([1, 1, 1]), fmt([]), fmt([0, 0, 0]), fmt([0, 1, 1, 1, 0, 1]), fmt([1]), fmt([0])]
    for n in (10, 50, 1000):
        out.append(fmt([random.choice([0, 1, 1]) for _ in range(n)]))
    out.append(fmt([1] * 40000))
    out.append(fmt([random.choice([0, 1]) for _ in range(40000)]))
    return out


def brute(inp):
    a = inp.split()[1:]
    s = ''.join(a)
    return max((len(x) for x in s.split('0')), default=0)
