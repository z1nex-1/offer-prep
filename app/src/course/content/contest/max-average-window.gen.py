import random


def tests():
    random.seed(59)
    out = ['5 1\n1 2 3 4 3\n', '5 2\n1 4 3 4 1\n', '1 1\n7\n', '4 4\n1 2 3 4\n', '6 3\n5 5 5 1 9 9\n']
    for n in (6, 15, 40):
        a = [random.randint(1, 20) for _ in range(n)]
        out.append(f"{n} {random.randint(1, n)}\n{' '.join(map(str, a))}\n")
    a = [random.randint(1, 10 ** 6) for _ in range(20000)]
    out.append(f"20000 137\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, a = d[0], d[1], d[2:]
    if n > 60:
        return None
    best = max(sum(a[i:j]) / (j - i) for i in range(n) for j in range(i + k, n + 1))
    return f"{best:.7f}"
