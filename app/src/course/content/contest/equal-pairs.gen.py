import random


def pack(a):
    return f'{len(a)}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(31)
    out = [pack([1, 2, 1, 1, 3]), pack([5, 6, 7]), pack([4]), pack([0, 0]), pack([-1, 1, -1, 1]), pack([7] * 10)]
    for n, k in ((20, 3), (200, 20), (1000, 10**9)):
        out.append(pack([random.randint(-k, k) for _ in range(n)]))
    out.append(pack([random.randint(1, 50) for _ in range(100000)]))
    out.append(pack([1] * 100000))
    out.append(pack([random.randint(-10**9, 10**9) for _ in range(20000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    a = d[1:]
    return str(sum(1 for i in range(len(a)) for j in range(i + 1, len(a)) if a[i] == a[j]))
