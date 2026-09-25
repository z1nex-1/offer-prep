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
    random.seed(4)
    out = ['3 2\n30 0\n10 3\n20 1\n', '1 1\n7 0\n', '4 1\n5 2\n5 3\n-1 4\n0 0\n']
    for n in (2, 5, 10, 50, 300, 2000):
        out.append(table([random.randint(-1000, 1000) for _ in range(n)]))
    out.append(table(list(range(30000, 0, -1))))
    out.append(table([random.randint(0, 9) for _ in range(30000)]))
    return out


def brute(inp):
    lines = inp.split('\n')
    n, head = map(int, lines[0].split())
    rows = [tuple(map(int, lines[i].split())) for i in range(1, n + 1)]
    order = []
    seen = set()
    cur = head
    for _ in range(n):
        if cur == 0 or cur in seen:
            break
        seen.add(cur)
        order.append(rows[cur - 1][0])
        cur = rows[cur - 1][1]
    return ' '.join(map(str, order))
