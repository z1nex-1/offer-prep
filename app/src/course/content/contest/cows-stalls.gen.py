import random


def tests():
    random.seed(56)
    out = ['5 3\n1 2 8 4 9\n', '2 2\n0 1000000000\n', '4 4\n1 2 3 4\n', '6 2\n5 1 9 3 7 11\n']
    for n in (5, 8, 11):
        xs = random.sample(range(0, 60), n)
        out.append(f"{n} {random.randint(2, n)}\n{' '.join(map(str, xs))}\n")
    xs = random.sample(range(0, 10 ** 9), 30000)
    out.append(f"30000 1000\n{' '.join(map(str, xs))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, x = d[0], d[1], sorted(d[2:])
    if n > 11:
        return None
    from itertools import combinations
    return max(min(c[i + 1] - c[i] for i in range(k - 1)) for c in combinations(x, k))
