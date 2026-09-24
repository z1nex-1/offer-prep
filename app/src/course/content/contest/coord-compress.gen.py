import random


def make(a):
    return f'{len(a)}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(61)
    out = [make([30, -10, 20, -10, 1000000000]), make([5]), make([7, 7, 7]), make([3, 2, 1]), make([-1000000000, 1000000000])]
    for n, c in ((5, 3), (8, 100), (10, 5), (20, 10**9)):
        for _ in range(3):
            out.append(make([random.randint(-c, c) for _ in range(n)]))
    n = 30000
    out.append(make([random.randint(-10**9, 10**9) for _ in range(n)]))
    out.append(make([random.randint(-1000, 1000) * 1000 for _ in range(n)]))
    return out


def brute(inp):
    data = inp.split()
    a = list(map(int, data[1:]))
    return ' '.join(str(sum(1 for v in set(a) if v < x) + 1) for x in a)
