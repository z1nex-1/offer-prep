import random


def table(values):
    n = len(values)
    ids = list(range(1, n + 1))
    random.shuffle(ids)
    val, nxt = [0] * (n + 1), [0] * (n + 1)
    for i, v in enumerate(values):
        val[ids[i]] = v
        nxt[ids[i]] = ids[i + 1] if i + 1 < n else 0
    rows = ''.join(f'{val[i]} {nxt[i]}\n' for i in range(1, n + 1))
    return f'{n} {ids[0]}\n{rows}'


def tests():
    random.seed(143)
    out = ['4 1\n1 2\n2 3\n3 4\n4 0\n', '5 3\n4 5\n2 4\n1 2\n3 1\n5 0\n', '1 1\n42 0\n', '2 2\n7 0\n6 1\n']
    for n in (3, 6, 7, 10, 31, 200, 1001):
        out.append(table(list(range(1, n + 1))))
        out.append(table([random.randint(-50, 50) for _ in range(n)]))
    out.append(table(list(range(1, 30001))))
    out.append(table([random.randint(0, 9) for _ in range(29999)]))
    return out


def brute(inp):
    lines = inp.split('\n')
    n, head = map(int, lines[0].split())
    rows = [lines[i].split() for i in range(1, n + 1)]
    order, cur = [], head
    while cur:
        order.append(rows[cur - 1][0])
        cur = int(rows[cur - 1][1])
    res, i, j = [], 0, n - 1
    while i <= j:
        res.append(order[i])
        if i != j:
            res.append(order[j])
        i += 1
        j -= 1
    return ' '.join(res)
