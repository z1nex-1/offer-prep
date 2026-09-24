import random


def pack(a):
    return f'{len(a)}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(43)
    out = [pack([1, 1, 1, 2, 2, 3]), pack([0, 1, 2, 2, 2, 3, 3, 3]), pack([5]), pack([5, 5]), pack([5, 5, 5, 5, 5]), pack([1, 2, 3, 4]),
           pack([-3, -3, -3, 0, 0, 0, 7])]
    for n, k in ((10, 3), (30, 5), (100, 10), (1000, 100)):
        out.append(pack(sorted(random.randint(-k, k) for _ in range(n))))
    out.append(pack(sorted(random.randint(-300, 300) for _ in range(100000))))
    out.append(pack(sorted(random.randint(-10**9, 10**9) for _ in range(15000))))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    from collections import Counter
    c = Counter()
    res = []
    for x in d[1:]:
        if c[x] < 2:
            res.append(x)
            c[x] += 1
    return f'{len(res)}\n' + ' '.join(map(str, res))
