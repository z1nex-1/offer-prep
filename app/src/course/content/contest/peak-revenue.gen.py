import random


def fmt(ev, k):
    return f"{len(ev)} {k}\n" + '\n'.join(f'{t} {v}' for t, v in ev) + '\n'


def tests():
    random.seed(71)
    out = [fmt([(0, 5), (10, 7), (3, 1)], 10), fmt([(5, 2), (5, 3), (6, 1)], 1), fmt([(100, 9)], 1), fmt([(0, 1), (9, 1), (10, 5)], 10)]
    for n in (6, 20, 80):
        ev = [(random.randint(0, 30), random.randint(1, 9)) for _ in range(n)]
        out.append(fmt(ev, random.randint(1, 12)))
    ev = [(random.randint(0, 10 ** 9), random.randint(1, 10 ** 6)) for _ in range(30000)]
    out.append(fmt(ev, 3 * 10 ** 5))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k = d[0], d[1]
    ev = [(d[2 + 2 * i], d[3 + 2 * i]) for i in range(n)]
    if n > 100:
        return None
    return max(sum(v for t, v in ev if s <= t < s + k) for s in set(t for t, _ in ev))
