import random


def tests():
    random.seed(125)
    out = ['kitten\nsitting\n', 'abc\nabc\n', '\nabc\n', 'abc\n\n', 'intention\nexecution\n']
    for n, m in ((5, 6), (10, 8), (30, 25)):
        a = ''.join(random.choice('abc') for _ in range(n))
        b = ''.join(random.choice('abc') for _ in range(m))
        out.append(f'{a}\n{b}\n')
    a = ''.join(random.choice('abcdef') for _ in range(1200))
    b = ''.join(random.choice('abcdef') for _ in range(1200))
    out.append(f'{a}\n{b}\n')
    return out


def brute(inp):
    lines = inp.split('\n')
    a, b = lines[0], lines[1]
    if len(a) * len(b) > 2000:
        return None
    from functools import lru_cache
    @lru_cache(maxsize=None)
    def d(i, j):
        if i == 0:
            return j
        if j == 0:
            return i
        if a[i - 1] == b[j - 1]:
            return d(i - 1, j - 1)
        return 1 + min(d(i - 1, j), d(i, j - 1), d(i - 1, j - 1))
    return d(len(a), len(b))
