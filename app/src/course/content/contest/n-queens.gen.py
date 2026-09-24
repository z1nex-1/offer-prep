from itertools import permutations

KNOWN = [1, 0, 0, 2, 10, 4, 40, 92, 352, 724, 2680]


def tests():
    return [f'{n}\n' for n in (4, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11)]


def brute(inp):
    n = int(inp)
    if n <= 8:
        return sum(len({r - p[r] for r in range(n)}) == n and len({r + p[r] for r in range(n)}) == n
                   for p in permutations(range(n)))
    return KNOWN[n - 1]
