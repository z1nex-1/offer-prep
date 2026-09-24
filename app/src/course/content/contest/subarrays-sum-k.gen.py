import random


def tests():
    random.seed(26)
    out = ['3 2\n1 1 1\n', '3 3\n1 2 3\n', '5 0\n0 0 0 0 0\n', '4 -1\n1 -1 -1 1\n', '1 5\n4\n']
    for n in (8, 40, 300):
        a = [random.randint(-3, 3) for _ in range(n)]
        out.append(f"{n} {random.randint(-4, 4)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(-2, 2) for _ in range(50000)]
    out.append(f"50000 1\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    res = 0
    for l in range(n):
        s = 0
        for r in range(l, n):
            s += a[r]
            res += s == k
    return res
