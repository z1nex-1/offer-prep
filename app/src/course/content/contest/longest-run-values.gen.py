import random


def tests():
    random.seed(27)
    out = ['6\n100 4 200 1 3 2\n', '1\n7\n', '4\n5 5 5 5\n', '5\n-2 -1 0 10 11\n']
    for n in (10, 50, 300):
        a = [random.randint(-20, 40) for _ in range(n)]
        out.append(f"{n}\n{' '.join(map(str, a))}\n")
    a = list(range(50000))
    random.shuffle(a)
    out.append(f"50000\n{' '.join(map(str, a))}\n")
    return out


def brute(inp):
    a = sorted(set(map(int, inp.split()[1:])))
    best = cur = 1
    for i in range(1, len(a)):
        cur = cur + 1 if a[i] == a[i - 1] + 1 else 1
        best = max(best, cur)
    return best
