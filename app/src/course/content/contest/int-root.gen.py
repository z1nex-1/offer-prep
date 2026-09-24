import random


def tests():
    random.seed(53)
    vals = [16, 17, 0, 1, 2, 3, 10 ** 18, 10 ** 18 - 1, 999999999999999999, (10 ** 9 - 1) ** 2, (10 ** 9 - 1) ** 2 - 1]
    vals += [random.randint(0, 10 ** 18) for _ in range(8)]
    return [f'{v}\n' for v in vals]


def brute(inp):
    import math
    return math.isqrt(int(inp))
