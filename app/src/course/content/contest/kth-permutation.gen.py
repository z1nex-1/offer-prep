import random
from itertools import permutations
from math import factorial


def fmt(n, ks):
    return f'{n} {len(ks)}\n' + ''.join(f'{k}\n' for k in ks)


def tests():
    random.seed(9)
    out = [fmt(3, [1, 4, 6]), fmt(4, [1, 2, 24, 13]), fmt(1, [1]), fmt(2, [1, 2]),
           fmt(5, list(range(1, 121))), fmt(8, [random.randint(1, factorial(8)) for _ in range(300)])]
    for n in (12, 17, 20, 20):
        out.append(fmt(n, [random.randint(1, factorial(n)) for _ in range(1000)]))
    out.append(fmt(20, [1, factorial(20), factorial(19), factorial(19) + 1, factorial(20) - 1]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, ks = d[0], d[2:]
    if n <= 8:
        perms = list(permutations(range(1, n + 1)))
        return '\n'.join(' '.join(map(str, perms[k - 1])) for k in ks)
    # Для больших n — вычитанием размеров веток, в нумерации с единицы.
    res = []
    for k in ks:
        free, cur = list(range(1, n + 1)), []
        while free:
            size = factorial(len(free) - 1)
            for x in free:
                if k <= size:
                    break
                k -= size
            cur.append(x)
            free.remove(x)
        res.append(' '.join(map(str, cur)))
    return '\n'.join(res)
