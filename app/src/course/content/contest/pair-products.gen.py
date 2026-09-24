import random


def pack(a):
    return f'{len(a)}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(33)
    out = [pack([1, 2, 3]), pack([-1, 5, -2, 4]), pack([7]), pack([0, 0, 0]), pack([10**9, 10**9]), pack([-10**9, 10**9, -10**9])]
    for n, k in ((10, 5), (100, 100), (1000, 10**9)):
        out.append(pack([random.randint(-k, k) for _ in range(n)]))
    out.append(pack([random.randint(-10**9, 10**9) for _ in range(40000)]))
    out.append(pack([10**9] * 30000 + [random.randint(0, 9) for _ in range(30000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    a = d[1:]
    return str(sum(a[i] * a[j] for i in range(len(a)) for j in range(i + 1, len(a))))
