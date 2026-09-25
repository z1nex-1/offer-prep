import random


def table(values, k):
    n = len(values)
    ids = list(range(1, n + 1))
    random.shuffle(ids)
    val, nxt = [0] * (n + 1), [0] * (n + 1)
    for i, v in enumerate(values):
        val[ids[i]] = v
        nxt[ids[i]] = ids[i + 1] if i + 1 < n else 0
    rows = ''.join(f'{val[i]} {nxt[i]}\n' for i in range(1, n + 1))
    return f'{n} {k} {ids[0]}\n{rows}'


def tests():
    random.seed(25)
    out = ['5 2 1\n1 2\n2 3\n3 4\n4 5\n5 0\n', '5 3 4\n2 3\n5 0\n3 5\n1 1\n4 2\n', '3 1 2\n9 0\n8 3\n7 1\n',
           '4 4 1\n1 2\n2 3\n3 4\n4 0\n', '3 5 1\n1 2\n2 3\n3 0\n']
    for n in (1, 2, 6, 7, 20, 100, 999):
        for k in (1, 2, 3, n, n + 1, random.randint(1, n + 1)):
            out.append(table(list(range(1, n + 1)), k))
    out.append(table([random.randint(0, 99) for _ in range(30000)], 7))
    out.append(table(list(range(1, 30001)), 29999))
    return out


def brute(inp):
    lines = inp.split('\n')
    n, k, head = map(int, lines[0].split())
    rows = [lines[i].split() for i in range(1, n + 1)]
    order, cur = [], head
    while cur:
        order.append(rows[cur - 1][0])
        cur = int(rows[cur - 1][1])
    res = []
    for i in range(0, n, k):
        g = order[i:i + k]
        res.extend(reversed(g) if len(g) == k else g)
    return ' '.join(res)
