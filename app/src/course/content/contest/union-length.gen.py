import random


def fmt(s):
    return f"{len(s)}\n" + '\n'.join(f'{a} {b}' for a, b in s) + '\n'


def tests():
    random.seed(35)
    out = [fmt([(1, 3), (2, 5), (7, 8)]), fmt([(0, 10), (2, 3)]), fmt([(4, 4)]), fmt([(-5, -1), (-1, 3)]), fmt([(1, 2), (3, 4)])]
    for n in (6, 25, 150):
        s = []
        for _ in range(n):
            l = random.randint(-40, 40)
            s.append((l, l + random.randint(0, 10)))
        out.append(fmt(s))
    s = []
    for _ in range(30000):
        l = random.randint(-10 ** 9, 10 ** 9 - 10 ** 6)
        s.append((l, l + random.randint(0, 10 ** 6)))
    out.append(fmt(s))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    s = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(d[0])]
    pts = sorted(set(x for a, b in s for x in (a, b)))
    return sum(pts[i + 1] - pts[i] for i in range(len(pts) - 1) if any(a <= pts[i] and pts[i + 1] <= b for a, b in s))
