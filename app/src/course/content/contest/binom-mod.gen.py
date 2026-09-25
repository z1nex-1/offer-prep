import random


def fmt(qs):
    return f"{len(qs)}\n" + '\n'.join(f'{n} {k}' for n, k in qs) + '\n'


def tests():
    random.seed(134)
    out = [fmt([(5, 2), (10, 0), (3, 5), (0, 0)]), fmt([(1, 1)]), fmt([(100, 50), (1000, 1)])]
    out.append(fmt([(random.randint(0, 30), random.randint(0, 30)) for _ in range(50)]))
    out.append(fmt([(random.randint(0, 2000), random.randint(0, 2000)) for _ in range(300)]))
    qs = [(random.randint(0, 10 ** 6), 0) for _ in range(25000)]
    qs = [(n, random.randint(0, n)) for n, _ in qs] + [(10 ** 6, 500000)]
    out.append(fmt(qs))
    return out


def brute(inp):
    import math
    d = list(map(int, inp.split()))
    q = d[0]
    qs = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(q)]
    if max(n for n, _ in qs) > 2000:
        return None
    return '\n'.join(str(math.comb(n, k) % (10 ** 9 + 7)) for n, k in qs)
