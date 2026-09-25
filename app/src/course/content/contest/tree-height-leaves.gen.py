import random


def fmt(n, par):
    return f'{n}\n{" ".join(map(str, par[2:]))}\n'


def random_tree(n, mode):
    # Случайная нумерация: родитель может иметь больший номер, чем ребёнок.
    perm = list(range(1, n + 1))
    rest = perm[1:]
    random.shuffle(rest)
    perm = [1] + rest
    par = [0] * (n + 1)
    for k in range(1, n):
        if mode == 'chain':
            j = k - 1
        elif mode == 'star':
            j = 0
        elif mode == 'deep':
            j = max(0, k - random.randint(1, 3))
        else:
            j = random.randrange(k)
        par[perm[k]] = perm[j]
    return par


def tests():
    random.seed(21)
    out = [fmt(5, [0, 0, 1, 1, 2, 2]), fmt(4, [0, 0, 3, 4, 1]), fmt(1, [0, 0]), fmt(2, [0, 0, 1])]
    for n, mode in ((10, 'rand'), (10, 'chain'), (100, 'deep'), (1000, 'rand'), (80000, 'chain'),
                    (10000, 'star'), (30000, 'rand'), (20000, 'deep')):
        out.append(fmt(n, random_tree(n, mode)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    par = [0, 0] + d[1:]

    def depth(v):
        k = 0
        while v != 1:
            v = par[v]
            k += 1
        return k
    parents = set(par[2:])
    return f'{max(depth(v) for v in range(1, n + 1))} {sum(v not in parents for v in range(1, n + 1))}'
