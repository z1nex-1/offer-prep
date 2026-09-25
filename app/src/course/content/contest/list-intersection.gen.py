import random


def build(p1, p2, t, extra):
    n = p1 + p2 + t + extra
    ids = list(range(1, n + 1))
    random.shuffle(ids)
    A, B, T, E = ids[:p1], ids[p1:p1 + p2], ids[p1 + p2:p1 + p2 + t], ids[p1 + p2 + t:]
    nxt = [0] * (n + 1)
    for chain in (A + T, B + T):
        for i in range(len(chain) - 1):
            nxt[chain[i]] = chain[i + 1]
    if E:
        for i in range(len(E) - 1):
            nxt[E[i]] = E[i + 1]
    h1 = (A + T)[0]
    h2 = (B + T)[0]
    return f'{n} {h1} {h2}\n{" ".join(map(str, nxt[1:]))}\n'


def tests():
    random.seed(160)
    out = ['7 1 5\n2 3 4 0 6 3 0\n', '4 1 3\n2 0 4 0\n', '3 2 2\n0 3 0\n', '1 1 1\n0\n', '5 1 4\n2 3 4 5 0\n']
    for p1, p2, t, e in ((0, 0, 1, 0), (1, 1, 0, 0), (0, 5, 3, 2), (6, 0, 2, 1), (3, 3, 0, 4), (2, 9, 4, 3),
                         (20, 1, 10, 5), (1, 30, 30, 0), (100, 150, 0, 50), (200, 50, 400, 100)):
        out.append(build(p1, p2, t, e))
    out.append(build(10000, 9999, 10000, 0))
    out.append(build(15000, 14999, 0, 0))
    out.append(build(1, 29000, 1, 998))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, h1, h2 = d[0], d[1], d[2]
    nxt = [0] + d[3:]
    seen = set()
    cur = h1
    while cur:
        seen.add(cur)
        cur = nxt[cur]
    cur = h2
    while cur and cur not in seen:
        cur = nxt[cur]
    return str(cur)
