import random


def build(a, c, extra):
    n = a + c + extra
    ids = list(range(2, n + 1))
    random.shuffle(ids)
    ids = [1] + ids
    nxt = [0] * (n + 1)
    path = ids[:a + c]
    for i in range(len(path) - 1):
        nxt[path[i]] = path[i + 1]
    if c:
        nxt[path[-1]] = path[a]
    for v in ids[a + c:]:
        nxt[v] = random.choice([0] + list(range(1, n + 1))) if n < 2000 else random.randint(0, n)
    return f'{n}\n{" ".join(map(str, nxt[1:]))}\n'


def tests():
    random.seed(1967)
    out = ['5\n2 3 4 5 3\n', '4\n2 3 4 0\n', '1\n1\n', '1\n0\n', '2\n2 1\n', '3\n2 3 3\n', '6\n4 0 1 5 6 4\n']
    for a, c, e in ((0, 3, 2), (3, 0, 4), (1, 1, 0), (2, 7, 5), (10, 1, 3), (0, 50, 20), (40, 0, 40),
                    (37, 64, 11), (150, 151, 100), (500, 0, 700), (1, 1999, 0)):
        out.append(build(a, c, e))
    out.append(build(0, 30000, 0))
    out.append(build(29999, 1, 0))
    out.append(build(12345, 17000, 5000))
    out.append(build(20000, 0, 10000))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, nxt = d[0], [0] + d[1:]
    pos, cur, i = {}, 1, 0
    while cur and cur not in pos:
        pos[cur] = i
        i += 1
        cur = nxt[cur]
    if cur == 0:
        return f'{i} 0'
    return f'{pos[cur]} {i - pos[cur]}'
