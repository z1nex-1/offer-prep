import random


def tests():
    random.seed(87)
    out = ['7 3\n1 3 2 4 5 3 1\n', '1 1\n5\n', '4 4\n4 3 2 1\n', '5 1\n3 1 2 5 4\n']
    for n in (8, 40, 200):
        a = [random.randint(-10, 10) for _ in range(n)]
        out.append(f"{n} {random.randint(1, n)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(-10 ** 9, 10 ** 9) for _ in range(40000)]
    out.append(f"40000 1000\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    return '\n'.join(str(min(a[i:i + k])) for i in range(n - k + 1))
