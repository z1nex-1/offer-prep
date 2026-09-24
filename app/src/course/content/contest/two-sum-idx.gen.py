import random


def tests():
    random.seed(23)
    out = ['4 9\n2 7 11 15\n', '3 6\n3 2 4\n', '2 6\n3 3\n', '3 100\n1 2 3\n', '1 2\n1\n', '5 4\n2 2 2 2 2\n']
    for n in (6, 30, 200):
        a = [random.randint(-20, 20) for _ in range(n)]
        out.append(f"{n} {random.randint(-30, 30)}\n{' '.join(map(str, a))}\n")
    a = random.sample(range(1, 10 ** 9), 50000)
    out.append(f"50000 {a[-1] + a[-2]}\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, t, a = d[0], d[1], d[2:]
    for j in range(n):
        for i in range(j):
            if a[i] + a[j] == t:
                return f'{i + 1} {j + 1}'
    return 0
