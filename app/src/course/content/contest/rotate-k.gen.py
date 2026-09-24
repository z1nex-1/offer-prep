import random


def pack(n, k, a):
    return f'{n} {k}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(41)
    out = [pack(7, 3, [1, 2, 3, 4, 5, 6, 7]), pack(3, 10, [1, 2, 3]), pack(1, 5, [42]), pack(4, 0, [4, 3, 2, 1]), pack(4, 4, [1, 2, 3, 4]),
           pack(5, 10**18, [1, 2, 3, 4, 5]), pack(5, 10**18 - 1, [-1, -2, -3, -4, -5]), pack(2, 1, [7, 7])]
    for n in (5, 10, 50):
        out.append(pack(n, random.randint(0, 200), [random.randint(-9, 9) for _ in range(n)]))
    n = 40000
    out.append(pack(n, random.randint(0, 10**18), [random.randint(-10**9, 10**9) for _ in range(n)]))
    return out


def brute(inp):
    d = inp.split()
    n, k = int(d[0]), int(d[1])
    a = d[2:]
    for _ in range(k % n):
        a = [a[-1]] + a[:-1]
    return ' '.join(a)
