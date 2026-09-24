import random


def tests():
    random.seed(55)
    out = ['5 2\n7 2 5 10 8\n', '5 3\n1 2 3 4 5\n', '4 4\n1 4 4 1\n', '1 1\n0\n', '3 1\n5 5 5\n']
    for n in (5, 8, 12):
        a = [random.randint(0, 20) for _ in range(n)]
        out.append(f"{n} {random.randint(1, n)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(0, 10 ** 9) for _ in range(30000)]
    out.append(f"30000 57\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    if n > 12:
        return None
    from itertools import combinations
    best = None
    for cuts in combinations(range(1, n), k - 1):
        b = (0,) + cuts + (n,)
        m = max(sum(a[b[i]:b[i + 1]]) for i in range(k))
        best = m if best is None else min(best, m)
    return best
