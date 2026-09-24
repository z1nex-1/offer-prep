import random


def tests():
    random.seed(46)
    out = ['2 3\n1 2\n', '4 3\n3 2 2 1\n', '4 5\n3 5 3 4\n', '1 10\n10\n', '3 10\n5 5 5\n']
    for n in (5, 9, 60):
        lim = random.randint(5, 20)
        w = [random.randint(1, lim) for _ in range(n)]
        out.append(f"{n} {lim}\n{' '.join(map(str, w))}\n")
    lim = 10 ** 9
    w = [random.randint(1, lim) for _ in range(50000)]
    out.append(f"50000 {lim}\n{' '.join(map(str, w))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, lim, w = d[0], d[1], d[2:]
    if n > 10:
        return None
    from functools import lru_cache
    @lru_cache(maxsize=None)
    def go(mask):
        if mask == (1 << n) - 1:
            return 0
        i = next(k for k in range(n) if not mask >> k & 1)
        best = 1 + go(mask | 1 << i)
        for j in range(i + 1, n):
            if not mask >> j & 1 and w[i] + w[j] <= lim:
                best = min(best, 1 + go(mask | 1 << i | 1 << j))
        return best
    return go(0)
