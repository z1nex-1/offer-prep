import random


def gen(n, reset_p, step):
    c, v = [], 0
    for _ in range(n):
        if random.random() < reset_p:
            v = random.randint(0, step)
        else:
            v += random.randint(0, step)
        c.append(v)
    return c


def tests():
    random.seed(72)
    out = ['5 2\n0 3 7 2 5\n', '3 3\n4 4 4\n', '1 1\n9\n', '4 1\n10 0 0 5\n']
    for n in (6, 20, 100):
        c = gen(n, 0.2, 5)
        out.append(f"{n} {random.randint(1, n)}\n{' '.join(map(str, c))}\n")
    c = gen(40000, 0.01, 1000)
    out.append(f"40000 600\n{' '.join(map(str, c))}\n")
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, k, c = d[0], d[1], d[2:]
    inc = [c[0]]
    for i in range(1, n):
        inc.append(c[i] if c[i] < c[i - 1] else c[i] - c[i - 1])
    return max(sum(inc[i:i + k]) for i in range(n - k + 1))
