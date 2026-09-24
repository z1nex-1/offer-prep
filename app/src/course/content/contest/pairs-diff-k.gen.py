import random


def tests():
    random.seed(29)
    out = ['5 2\n1 5 3 4 2\n', '4 0\n1 1 1 2\n', '3 10\n1 2 3\n', '1 0\n5\n', '4 1\n2 2 3 3\n']
    for n in (8, 40, 300):
        a = [random.randint(-10, 10) for _ in range(n)]
        out.append(f"{n} {random.randint(0, 5)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(1, 1000) for _ in range(50000)]
    out.append(f"50000 7\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    return sum(1 for i in range(n) for j in range(i + 1, n) if abs(a[i] - a[j]) == k)
