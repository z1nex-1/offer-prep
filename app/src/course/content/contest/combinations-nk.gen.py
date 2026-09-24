from itertools import combinations
from math import comb


def tests():
    pairs = [(4, 2), (3, 3), (1, 1), (5, 1), (5, 3), (6, 4), (10, 5), (12, 11), (13, 13),
             (14, 6), (15, 5), (16, 3), (16, 15), (16, 16), (16, 12)]
    assert all(comb(n, k) <= 5000 for n, k in pairs)
    return [f'{n} {k}\n' for n, k in pairs]


def brute(inp):
    n, k = map(int, inp.split())
    return '\n'.join(' '.join(map(str, c)) for c in combinations(range(1, n + 1), k))
