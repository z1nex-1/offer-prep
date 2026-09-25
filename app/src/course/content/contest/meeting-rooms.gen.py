import random


def fmt(m):
    return f"{len(m)}\n" + '\n'.join(f'{s} {e}' for s, e in m) + '\n'


def tests():
    random.seed(114)
    out = [fmt([(0, 30), (5, 10), (15, 20)]), fmt([(7, 10), (2, 4)]), fmt([(1, 5), (5, 10)]), fmt([(1, 2)] * 3)]
    for n in (6, 20, 100):
        m = []
        for _ in range(n):
            s = random.randint(0, 40)
            m.append((s, s + random.randint(1, 10)))
        out.append(fmt(m))
    m = []
    for _ in range(40000):
        s = random.randint(0, 10 ** 6)
        m.append((s, s + random.randint(1, 5000)))
    out.append(fmt(m))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    m = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(d[0])]
    return max(sum(1 for s, e in m if s <= t < e) for t in set(s for s, _ in m))
