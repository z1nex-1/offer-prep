import random


def fmt(s):
    return f"{len(s)}\n" + '\n'.join(f'{a} {b}' for a, b in s) + '\n'


def tests():
    random.seed(33)
    out = [fmt([(1, 5), (2, 6), (5, 8)]), fmt([(1, 2)]), fmt([(1, 5), (5, 6)]), fmt([(1, 10), (2, 3), (4, 5), (6, 7)]), fmt([(3, 4), (3, 4), (3, 4)])]
    for n in (6, 25, 200):
        s = []
        for _ in range(n):
            a = random.randint(1, 30)
            s.append((a, a + random.randint(1, 8)))
        out.append(fmt(s))
    s = []
    for _ in range(40000):
        a = random.randint(1, 10 ** 6)
        s.append((a, a + random.randint(1, 10 ** 4)))
    out.append(fmt(s))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    s = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(d[0])]
    days = sorted(set(a for a, _ in s))
    return max(sum(1 for a, b in s if a <= t < b) for t in days)
