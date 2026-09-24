import random


def tests():
    random.seed(16)
    out = ['5 6\n1 5 2 4 3\n', '3 -1\n1 2 3\n', '1 10\n5\n', '4 0\n0 0 0 0\n', '4 3\n-5 10 -2 4\n']
    for n in (6, 20, 150):
        a = [random.randint(-20, 20) for _ in range(n)]
        out.append(f"{n} {random.randint(-30, 30)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(-10 ** 9, 10 ** 9) for _ in range(50000)]
    out.append(f"50000 {random.randint(-10 ** 9, 10 ** 9)}\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, s, a = d[0], d[1], d[2:]
    return sum(1 for i in range(n) for j in range(i + 1, n) if a[i] + a[j] <= s)
