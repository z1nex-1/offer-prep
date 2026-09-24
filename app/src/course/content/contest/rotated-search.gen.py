import random


def fmt(a, qs):
    return f"{len(a)} {len(qs)}\n{' '.join(map(str, a))}\n{' '.join(map(str, qs))}\n"


def tests():
    random.seed(58)
    out = [fmt([4, 5, 6, 7, 0, 1, 2], [0, 3, 4, 2]), fmt([1], [1, 0]), fmt([1, 2, 3], [3, 1]), fmt([3, 1], [1, 3, 2])]
    for n in (5, 20, 100):
        s = sorted(random.sample(range(-100, 100), n))
        k = random.randint(0, n - 1)
        a = s[k:] + s[:k]
        out.append(fmt(a, [random.randint(-110, 110) for _ in range(n)]))
    s = sorted(random.sample(range(-10 ** 9, 10 ** 9), 30000))
    k = 12345
    out.append(fmt(s[k:] + s[:k], [random.choice(s) if random.random() < 0.5 else random.randint(-10 ** 9, 10 ** 9) for _ in range(30000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, q = d[0], d[1]
    a = d[2:2 + n]
    return ' '.join(str(a.index(x) + 1 if x in a else -1) for x in d[2 + n:])
