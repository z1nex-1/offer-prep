import random


def tests():
    random.seed(118)
    out = ['8 3\n1 3 -1 -3 5 3 6 7\n', '5 1\n4 2 9 1 7\n', '4 4\n2 2 2 2\n', '6 2\n5 5 1 1 5 5\n']
    for n in (10, 40, 150):
        a = [random.randint(-5, 5) for _ in range(n)]
        out.append(f"{n} {random.randint(1, n)}\n{' '.join(map(str, a))}\n")
    for k in (1, 2, 1000):
        a = [random.randint(-10 ** 9, 10 ** 9) for _ in range(10000)]
        out.append(f"10000 {k}\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    if n * k > 200000:
        return None
    return ' '.join(str(sorted(a[i:i + k])[(k + 1) // 2 - 1]) for i in range(n - k + 1))
