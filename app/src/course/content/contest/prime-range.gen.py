import random


def fmt(qs):
    return f"{len(qs)}\n" + '\n'.join(f'{l} {r}' for l, r in qs) + '\n'


def tests():
    random.seed(135)
    out = [fmt([(1, 10), (11, 20), (1, 1), (2, 2)]), fmt([(1, 1)]), fmt([(4, 4), (97, 97)])]
    qs = []
    for _ in range(60):
        l = random.randint(1, 500)
        qs.append((l, random.randint(l, 500)))
    out.append(fmt(qs))
    qs = []
    for _ in range(50000):
        l = random.randint(1, 10 ** 6)
        qs.append((l, random.randint(l, 10 ** 6)))
    out.append(fmt(qs + [(1, 10 ** 6)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    q = d[0]
    qs = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(q)]
    if max(r for _, r in qs) > 1000:
        return None
    def pr(x):
        return x > 1 and all(x % t for t in range(2, int(x ** 0.5) + 1))
    return '\n'.join(str(sum(pr(x) for x in range(l, r + 1))) for l, r in qs)
