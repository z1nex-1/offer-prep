import random


def tests():
    random.seed(54)
    out = ['4 8\n3 6 7 11\n', '5 5\n30 11 23 4 20\n', '5 6\n30 11 23 4 20\n', '1 1000000000\n1000000000\n', '1 1\n7\n']
    for n in (3, 6, 20):
        p = [random.randint(1, 30) for _ in range(n)]
        out.append(f"{n} {random.randint(n, 3 * n + 10)}\n{' '.join(map(str, p))}\n")
    p = [random.randint(1, 10 ** 9) for _ in range(30000)]
    out.append(f"30000 {random.randint(30000, 10 ** 6)}\n{' '.join(map(str, p))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, h, p = d[0], d[1], d[2:]
    if max(p) > 100:
        return None
    for k in range(1, max(p) + 1):
        if sum((x + k - 1) // k for x in p) <= h:
            return k
