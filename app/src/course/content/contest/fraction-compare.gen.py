import random
from fractions import Fraction

N = 10**18


def pack(qs):
    return f'{len(qs)}\n' + '\n'.join(' '.join(map(str, x)) for x in qs) + '\n'


def near():
    b = random.randint(N // 2, N - 1)
    a = random.randint(2, b)
    return (a, b, a + random.choice([-1, 0, 1]), b + random.choice([-1, 0, 1]))


def tests():
    random.seed(22)
    out = [pack([(1, 2, 2, 4), (1, 3, 1, 2), (3, 4, 2, 3)]),
           pack([(N - 1, N, N - 2, N - 1), (N - 2, N - 1, N - 1, N), (N, N, 1, 1), (1, N, 1, N - 1)]),
           pack([(5, 7, 5, 7)]), pack([(N, 1, N, 1), (N, 1, N - 1, 1), (1, N, 2, 2 * 10**17)])]
    out.append(pack([(random.randint(1, 10), random.randint(1, 10), random.randint(1, 10), random.randint(1, 10)) for _ in range(200)]))
    qs = []
    for _ in range(3000):
        x = random.randint(1, 10**9)
        y = random.randint(1, 10**9)
        k1, k2 = random.randint(1, 10**9), random.randint(1, 10**9)
        qs.append((x * k1, y * k1, x * k2, y * k2) if random.random() < 0.3 else near())
    out.append(pack(qs))
    out.append(pack([tuple(random.randint(1, N) for _ in range(4)) for _ in range(3000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    res = []
    for i in range(d[0]):
        a, b, c, e = d[1 + 4 * i:5 + 4 * i]
        x, y = Fraction(a, b), Fraction(c, e)
        res.append('<' if x < y else '>' if x > y else '=')
    return '\n'.join(res)
