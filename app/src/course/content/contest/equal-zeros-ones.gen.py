import random


def tests():
    random.seed(28)
    out = ['2\n0 1\n', '3\n0 1 0\n', '1\n1\n', '4\n1 1 1 1\n', '6\n0 0 1 0 1 1\n']
    for n in (8, 30, 200):
        a = [random.randint(0, 1) for _ in range(n)]
        out.append(f"{n}\n{' '.join(map(str, a))}\n")
    a = [random.randint(0, 1) for _ in range(50000)]
    out.append(f"50000\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    a = inp.split()[1:]
    n = len(a)
    best = 0
    for l in range(n):
        z = o = 0
        for r in range(l, n):
            if a[r] == '1':
                o += 1
            else:
                z += 1
            if z == o:
                best = max(best, r - l + 1)
    return best
