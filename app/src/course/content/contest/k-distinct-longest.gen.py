import random


def tests():
    random.seed(67)
    out = ['5 2\n1 2 1 2 3\n', '5 1\n1 1 2 2 2\n', '3 3\n1 2 3\n', '1 1\n9\n']
    for n in (8, 40, 200):
        a = [random.randint(1, 6) for _ in range(n)]
        out.append(f"{n} {random.randint(1, 4)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(1, 50) for _ in range(40000)]
    out.append(f"40000 7\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    best = 0
    for i in range(n):
        seen = set()
        for j in range(i, n):
            seen.add(a[j])
            if len(seen) > k:
                break
            best = max(best, j - i + 1)
    return best
