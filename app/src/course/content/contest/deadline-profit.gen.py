import random


def fmt(j):
    return f"{len(j)}\n" + '\n'.join(f'{d} {p}' for d, p in j) + '\n'


def tests():
    random.seed(47)
    out = [fmt([(2, 100), (1, 19), (2, 27), (1, 25), (3, 15)]), fmt([(1, 5)]), fmt([(1, 5), (1, 7), (1, 3)]), fmt([(5, 1), (5, 2)])]
    for n in (5, 8, 10):
        out.append(fmt([(random.randint(1, 4), random.randint(1, 20)) for _ in range(n)]))
    out.append(fmt([(random.randint(1, 20000), random.randint(1, 10 ** 9)) for _ in range(40000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    jobs = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(d[0])]
    n = len(jobs)
    if n > 10:
        return None
    best = 0
    for mask in range(1 << n):
        ch = sorted(jobs[i] for i in range(n) if mask >> i & 1)
        if all(ch[k][0] >= k + 1 for k in range(len(ch))):
            best = max(best, sum(p for _, p in ch))
    return best
