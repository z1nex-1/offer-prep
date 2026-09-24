import random


def tests():
    random.seed(57)
    out = ['4 11\n802 743 457 539\n', '1 1\n5\n', '2 100\n3 4\n', '3 3\n10 10 10\n']
    for n in (3, 6, 20):
        r = [random.randint(1, 50) for _ in range(n)]
        out.append(f"{n} {random.randint(1, 60)}\n{' '.join(map(str, r))}\n")
    r = [random.randint(1, 10 ** 7) for _ in range(30000)]
    out.append(f"30000 123456789\n{' '.join(map(str, r))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, r = d[0], d[1], d[2:]
    if max(r) > 1000:
        return None
    best = 0
    for x in range(1, max(r) + 1):
        if sum(v // x for v in r) >= k:
            best = x
    return best
