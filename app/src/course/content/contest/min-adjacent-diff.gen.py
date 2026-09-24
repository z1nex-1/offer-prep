import random


def tests():
    random.seed(31)
    out = ['4\n10 3 7 20\n', '2\n5 5\n', '3\n-1000000000 0 1000000000\n', '5\n1 9 4 12 6\n']
    for n in (6, 40, 300):
        a = [random.randint(-10 ** 4, 10 ** 4) for _ in range(n)]
        out.append(f"{n}\n{' '.join(map(str, a))}\n")
    a = random.sample(range(-10 ** 9, 10 ** 9, 7), 40000)
    out.append(f"40000\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    return min(abs(a[i] - a[j]) for i in range(len(a)) for j in range(i + 1, len(a)))
