import random


def fmt(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"


def tests():
    random.seed(13)
    out = [fmt([0, 1, 2, 4, 5, 7]), fmt([5]), fmt([1, 3, 5]), fmt([-3, -2, -1, 1]), fmt([1, 2])]
    for n in (10, 50):
        s = sorted(random.sample(range(-30, 60), n))
        out.append(fmt(s))
    x, a = -10 ** 9, []
    for _ in range(40000):
        a.append(x)
        x += random.choice([1, 1, 1, 2, 5])
    out.append(fmt(a))
    return out


def brute(inp):
    a = list(map(int, inp.split()[1:]))
    groups = []
    for x in a:
        if groups and groups[-1][-1] + 1 == x:
            groups[-1].append(x)
        else:
            groups.append([x])
    return ','.join(str(g[0]) if len(g) == 1 else f'{g[0]}-{g[-1]}' for g in groups)
