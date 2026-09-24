import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(38)
    out = [fmt([3, 30, 34, 5, 9]), fmt([10, 2]), fmt([0, 0, 0]), fmt([0]), fmt([121, 12]), fmt([8, 89, 898])]
    for n in (4, 6, 7):
        out.append(fmt([random.choice([0, 1, 9, 10, 11, 90, 99, 100, 101, 5, 56, 565]) for _ in range(n)]))
    out.append(fmt([random.randint(0, 10 ** 9) for _ in range(30000)]))
    return out


def brute(inp):
    from itertools import permutations
    a = inp.split()[1:]
    if len(a) > 7:
        return None
    best = max(int(''.join(p)) for p in permutations(a))
    return str(best)
