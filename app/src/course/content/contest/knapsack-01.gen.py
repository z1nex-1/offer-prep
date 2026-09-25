import random


def fmt(items, cap):
    return f"{len(items)} {cap}\n" + '\n'.join(f'{w} {v}' for w, v in items) + '\n'


def tests():
    random.seed(126)
    out = [fmt([(1, 15), (3, 20), (4, 30)], 4), fmt([(5, 10)], 4), fmt([(2, 3), (2, 3), (2, 3)], 4), fmt([(1, 1)], 1)]
    for n, cap in ((5, 10), (10, 20), (14, 30)):
        out.append(fmt([(random.randint(1, cap), random.randint(1, 50)) for _ in range(n)], cap))
    out.append(fmt([(random.randint(1, 3000), random.randint(1, 10 ** 9)) for _ in range(100)], 10000))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, cap = d[0], d[1]
    if n > 15:
        return None
    items = [(d[2 + 2 * i], d[3 + 2 * i]) for i in range(n)]
    best = 0
    for mask in range(1 << n):
        w = sum(items[i][0] for i in range(n) if mask >> i & 1)
        if w <= cap:
            best = max(best, sum(items[i][1] for i in range(n) if mask >> i & 1))
    return best
