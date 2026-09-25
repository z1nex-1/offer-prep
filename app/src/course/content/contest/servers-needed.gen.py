import random


def tests():
    random.seed(132)
    out = ['3 10\n25 10 0\n', '1 1000000000\n1000000000000000001\n', '2 7\n1 7\n', '1 1\n0\n']
    for n in (5, 20):
        c = random.randint(1, 50)
        out.append(f"{n} {c}\n{' '.join(str(random.randint(0, 500)) for _ in range(n))}\n")
    c = 10 ** 9
    out.append(f"50 {c}\n{' '.join(str(random.randint(10 ** 17, 2 * 10 ** 18)) for _ in range(49))} {10 ** 18 + 1}\n")
    c = 999999937
    out.append(f"50000 {c}\n{' '.join(str(c * random.randint(0, 10 ** 9) + random.choice([0, 1])) for _ in range(50000))}\n")
    return out


def brute(inp):
    from fractions import Fraction
    import math
    d = list(map(int, inp.split()))
    n, c = d[0], d[1]
    return sum(math.ceil(Fraction(r, c)) for r in d[2:2 + n])
