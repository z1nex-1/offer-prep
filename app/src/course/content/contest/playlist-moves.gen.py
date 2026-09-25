import random


def fmt(n, cmds):
    return f'{n} {len(cmds)}\n' + ''.join(f'{x} {y}\n' for x, y in cmds)


def rand_cmds(n, q, zero=0.2):
    cmds = []
    for _ in range(q):
        x = random.randint(1, n)
        y = 0 if random.random() < zero else random.randint(1, n)
        while y == x:
            y = random.randint(0, n)
        cmds.append((x, y))
    return cmds


def tests():
    random.seed(7)
    out = [fmt(5, [(1, 3), (5, 0), (2, 4)]), fmt(3, [(2, 1), (3, 0), (3, 2)]), fmt(2, [(1, 2), (1, 2)]),
           fmt(4, [(4, 0), (3, 0), (2, 0), (1, 0)])]
    for n in (2, 3, 5, 10, 30, 200):
        for q in (1, n, 3 * n):
            out.append(fmt(n, rand_cmds(n, q)))
    n = 50000
    out.append(fmt(n, [(n - i % 997, n - (i + 400) % 997) for i in range(35000)]))
    out.append(fmt(5000, rand_cmds(5000, 5000)))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, q = d[0], d[1]
    if n > 5000:
        return None
    row = list(range(1, n + 1))
    for i in range(q):
        x, y = d[2 + 2 * i], d[3 + 2 * i]
        row.remove(x)
        row.insert(row.index(y) + 1 if y else 0, x)
    return ' '.join(map(str, row))
