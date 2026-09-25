import random


def tests():
    random.seed(121)
    out = ['4 0\n\n', '4 1\n2\n', '1 0\n\n', '5 2\n1 2\n', '10 3\n3 4 5\n']
    for n in (8, 15, 25):
        b = random.sample(range(1, n), random.randint(0, n // 3))
        out.append(f"{n} {len(b)}\n{' '.join(map(str, b))}\n")
    b = random.sample(range(1, 300000), 1000)
    out.append(f"300000 1000\n{' '.join(map(str, b))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k = d[0], d[1]
    if n > 25:
        return None
    broken = set(d[2:2 + k])
    def ways(i):
        if i == n:
            return 1
        if i > n or i in broken:
            return 0
        return ways(i + 1) + ways(i + 2) + ways(i + 3)
    return ways(0) % (10 ** 9 + 7)
