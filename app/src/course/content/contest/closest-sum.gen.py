import random


def tests():
    random.seed(17)
    out = ['4 1\n-1 2 1 -4\n', '2 100\n1 2\n', '3 5\n2 2 4\n', '4 0\n-3 -1 1 3\n', '5 10\n1 1 1 1 1\n']
    for n in (5, 12, 80):
        a = [random.randint(-30, 30) for _ in range(n)]
        out.append(f"{n} {random.randint(-40, 40)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(-10 ** 9, 10 ** 9) for _ in range(50000)]
    out.append(f"50000 {random.randint(-10 ** 9, 10 ** 9)}\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, x, a = d[0], d[1], d[2:]
    return min((abs(a[i] + a[j] - x), a[i] + a[j]) for i in range(n) for j in range(i + 1, n))[1]
