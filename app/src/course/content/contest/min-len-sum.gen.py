import random


def tests():
    random.seed(66)
    out = ['6 7\n2 3 1 2 4 3\n', '3 4\n1 4 4\n', '8 11\n1 1 1 1 1 1 1 1\n', '1 5\n5\n', '2 100\n1 2\n']
    for n in (8, 40, 200):
        a = [random.randint(1, 10) for _ in range(n)]
        out.append(f"{n} {random.randint(1, 40)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(1, 10 ** 9) for _ in range(40000)]
    out.append(f"40000 {10 ** 12}\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, s, a = d[0], d[1], d[2:]
    best = 0
    for i in range(n):
        t = 0
        for j in range(i, n):
            t += a[j]
            if t >= s:
                if best == 0 or j - i + 1 < best:
                    best = j - i + 1
                break
    return best
