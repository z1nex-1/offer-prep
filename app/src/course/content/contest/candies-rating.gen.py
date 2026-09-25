import random


def make(r):
    return f'{len(r)}\n' + ' '.join(map(str, r)) + '\n'


def rnd(n, c):
    return [random.randint(0, c) for _ in range(n)]


def tests():
    random.seed(97)
    out = [make([1, 3, 4, 5, 2]), make([1, 2, 2]), make([7]), make([3, 2, 1]), make([1, 2, 3]),
           make([5, 5, 5, 5]), make([1, 0, 2]), make([2, 1, 2, 1, 2]), make([1, 3, 2, 2, 1]),
           make([0, 10000, 0])]
    for n, c in ((4, 3), (8, 5), (15, 10), (50, 20), (200, 3), (200, 10000)):
        for _ in range(2):
            out.append(make(rnd(n, c)))
    n = 50000
    out.append(make(rnd(n, 10000)))
    out.append(make(list(range(10000)) * 5))
    out.append(make(list(range(10000, 0, -1)) * 5))
    out.append(make(list(range(25000)[:10001]) + list(range(10000, -1, -1)) + rnd(n - 20003, 5)))
    return out


def brute(inp):
    data = list(map(int, inp.split()))
    n = data[0]
    if n > 200:
        return None
    r = data[1:n + 1]
    c = [1] * n
    changed = True
    while changed:
        changed = False
        for i in range(n):
            for j in (i - 1, i + 1):
                if 0 <= j < n and r[i] > r[j] and c[i] <= c[j]:
                    c[i] = c[j] + 1
                    changed = True
    return sum(c)
