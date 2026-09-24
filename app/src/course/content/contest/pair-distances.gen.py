import random


def pack(a):
    return f'{len(a)}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(34)
    out = [pack([1, 4, 2]), pack([5, -5, 0, 5]), pack([3]), pack([2, 2, 2]), pack([-10**9, 10**9]), pack(list(range(10, 0, -1)))]
    for n, k in ((10, 5), (100, 50), (1000, 10**9)):
        out.append(pack([random.randint(-k, k) for _ in range(n)]))
    out.append(pack([random.randint(-10**9, 10**9) for _ in range(40000)]))
    out.append(pack([random.randint(0, 99) for _ in range(100000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    a = d[1:]
    return str(sum(abs(a[i] - a[j]) for i in range(len(a)) for j in range(i + 1, len(a))))
