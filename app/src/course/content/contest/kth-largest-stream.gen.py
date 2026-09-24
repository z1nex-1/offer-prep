import random


def pack(k, a):
    return f'{len(a)} {k}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(24)
    out = [pack(3, [4, 5, 8, 2, 3, 5, 10, 9, 4]), pack(1, [3, -1, 7, 7, 2]), pack(1, [5]), pack(2, [5, 5, 5, 5]), pack(4, [1, 2, 3]),
           pack(3, [-5, -4, -3, -2, -1]), pack(3, [10, 9, 8, 7, 6])]
    for n, k, v in ((10, 3, 5), (50, 7, 20), (200, 200, 100), (1000, 1, 10**9), (1000, 500, 10**9)):
        out.append(pack(k, [random.randint(-v, v) for _ in range(n)]))
    out.append(pack(1000, [random.randint(-10**9, 10**9) for _ in range(30000)]))
    out.append(pack(15000, list(range(30000))))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k = d[0], d[1]
    a = d[2:2 + n]
    res = []
    for i in range(n):
        s = sorted(a[:i + 1], reverse=True)
        res.append(s[k - 1] if len(s) >= k else -1)
    return ' '.join(map(str, res))
