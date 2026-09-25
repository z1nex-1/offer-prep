import random


def make(T, F, st):
    return f'{T} {F} {len(st)}\n' + ''.join(f'{p} {g}\n' for p, g in st)


def rnd(n, T, gmax):
    return [(random.randint(1, T - 1), random.randint(1, gmax)) for _ in range(n)]


def tests():
    random.seed(73)
    out = [make(100, 10, [(10, 60), (20, 30), (30, 30), (60, 40)]), make(100, 1, [(10, 100)]),
           make(1, 1, []), make(100, 100, [(50, 10)]), make(100, 50, []), make(10, 5, [(5, 5)]),
           make(10, 5, [(6, 100)]), make(20, 5, [(5, 1), (5, 3), (5, 11)]), make(100, 10, [(10, 10), (10, 90), (20, 70)])]
    for n, T, g in ((3, 30, 15), (5, 50, 25), (8, 100, 40), (10, 60, 20), (12, 200, 70)):
        for _ in range(3):
            out.append(make(T, random.randint(0, T // 4), rnd(n, T, g)))
    T = 10**9
    out.append(make(T, 10**5, rnd(20000, T, 3 * 10**5)))
    pos, p = [], 0
    for _ in range(20000):
        p += random.randint(1, 50000)
        pos.append(p)
    chain = [(q, random.randint(20000, 60000)) for q in pos]
    random.shuffle(chain)
    out.append(make(pos[-1] + 30000, pos[0], chain))
    out.append(make(10**9, 10**6, [(random.randint(1, 10**6), random.randint(1, 10**5)) for _ in range(19990)] + [(10**6, 10**9)] * 10))
    return out


def brute(inp):
    data = list(map(int, inp.split()))
    T, F, n = data[0], data[1], data[2]
    if n > 3000:
        return None
    st = sorted((data[3 + 2 * i], data[4 + 2 * i]) for i in range(n))
    best = [F] + [-1] * n
    for p, g in st:
        for k in range(n - 1, -1, -1):
            if best[k] >= p:
                best[k + 1] = max(best[k + 1], best[k] + g)
    for k in range(n + 1):
        if best[k] >= T:
            return k
    return -1
