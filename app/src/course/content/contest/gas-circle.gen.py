import random


def make(g, c):
    return f'{len(g)}\n' + ' '.join(map(str, g)) + '\n' + ' '.join(map(str, c)) + '\n'


def rnd(n, m):
    return [random.randint(0, m) for _ in range(n)], [random.randint(0, m) for _ in range(n)]


def balanced(n, m):
    g, c = rnd(n, m)
    d = sum(c) - sum(g)
    i = 0
    while d > 0:
        add = min(d, 10**4 - g[i % n])
        g[i % n] += add
        d -= add
        i += 1
    return g, c


def tests():
    random.seed(101)
    out = [make([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), make([2, 3, 4], [3, 4, 3]),
           make([0], [0]), make([5], [3]), make([3], [5]), make([1, 1, 1], [1, 1, 1]),
           make([0, 2], [1, 1]), make([4, 0, 0], [1, 1, 2]), make([0, 0, 5], [1, 1, 3])]
    for n, m in ((3, 3), (5, 5), (10, 10), (50, 20), (300, 100)):
        for _ in range(2):
            out.append(make(*rnd(n, m)))
            out.append(make(*balanced(n, m)))
    n = 30000
    out.append(make(*balanced(n, 10**4)))
    out.append(make(*balanced(n, 1000)))
    g, c = [5] * n, [5] * n
    g[n - 2], g[n - 1] = 4, 6
    out.append(make(g, c))
    g, c = [100] * n, [100] * n
    g[n // 2 - 1] -= 1
    g[n // 2] += 1
    out.append(make(g, c))
    return out


def brute(inp):
    data = list(map(int, inp.split()))
    n = data[0]
    if n > 300:
        return None
    g, c = data[1:n + 1], data[n + 1:2 * n + 1]
    for s in range(n):
        tank = 0
        for k in range(n):
            i = (s + k) % n
            tank += g[i] - c[i]
            if tank < 0:
                break
        else:
            return s + 1
    return -1
