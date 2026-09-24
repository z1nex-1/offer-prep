import random


def pack(a):
    return f'{len(a)}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(42)
    out = [pack([2, 0, 2, 1, 1, 0]), pack([0]), pack([2]), pack([2, 1, 0]), pack([1, 1, 1]), pack([2, 2, 0, 0]), pack([0, 1, 2, 0, 1, 2])]
    for n in (5, 10, 30, 100):
        out.append(pack([random.randint(0, 2) for _ in range(n)]))
    out.append(pack([random.randint(0, 2) for _ in range(100000)]))
    out.append(pack([2] * 50000 + [0] * 50000))
    return out


def brute(inp):
    d = inp.split()
    return ' '.join(sorted(d[1:]))
