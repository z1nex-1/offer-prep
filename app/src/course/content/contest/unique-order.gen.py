import random


def pack(a):
    return f'{len(a)}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(14)
    out = [pack([3, 1, 3, 2, 1, 5]), pack([7, 7, 7]), pack([1]), pack([-1, 1, -1, 0, 0, 1]), pack(list(range(10, 0, -1)))]
    for n, k in ((20, 5), (100, 30), (1000, 1000)):
        out.append(pack([random.randint(-k, k) for _ in range(n)]))
    out.append(pack(random.sample(range(-10**9, 10**9), 25000)))
    out.append(pack([random.randint(1, 1000) for _ in range(30000)]))
    return out


def brute(inp):
    d = inp.split()
    res = []
    for x in d[1:]:
        if int(x) not in [int(y) for y in res]:
            res.append(x)
    return ' '.join(res)
