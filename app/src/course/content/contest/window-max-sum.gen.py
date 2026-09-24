import random


def tests():
    random.seed(64)
    out = ['6 2\n1 3 -1 4 2 -5\n', '3 3\n-1 -2 -3\n', '1 1\n5\n', '5 1\n-5 -1 -9 -2 -3\n']
    for n in (8, 40, 200):
        a = [random.randint(-20, 20) for _ in range(n)]
        out.append(f"{n} {random.randint(1, n)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(-10 ** 9, 10 ** 9) for _ in range(40000)]
    out.append(f"40000 777\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    return max(sum(a[i:i + k]) for i in range(n - k + 1))
