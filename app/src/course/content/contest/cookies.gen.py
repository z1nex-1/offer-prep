import random


def tests():
    random.seed(42)
    out = ['3 2\n1 2 3\n1 1\n', '2 3\n1 2\n1 2 3\n', '1 1\n5\n4\n', '3 3\n2 2 2\n2 2 2\n']
    for n, m in ((4, 5), (8, 6), (100, 120)):
        g = [random.randint(1, 10) for _ in range(n)]
        s = [random.randint(1, 10) for _ in range(m)]
        out.append(f"{n} {m}\n{' '.join(map(str, g))}\n{' '.join(map(str, s))}\n")
    g = [random.randint(1, 10 ** 9) for _ in range(30000)]
    s = [random.randint(1, 10 ** 9) for _ in range(30000)]
    out.append(f"30000 30000\n{' '.join(map(str, g))}\n{' '.join(map(str, s))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    g, s = d[2:2 + n], d[2 + n:]
    if n > 9 or m > 9:
        return None
    from functools import lru_cache
    @lru_cache(maxsize=None)
    def go(i, used):
        if i == n:
            return 0
        best = go(i + 1, used)
        for j in range(m):
            if not used >> j & 1 and s[j] >= g[i]:
                best = max(best, 1 + go(i + 1, used | 1 << j))
        return best
    return go(0, 0)
