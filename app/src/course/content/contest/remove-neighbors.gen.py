import random


def fmt(n, order):
    return f'{n} {len(order)}\n{" ".join(map(str, order))}\n'


def tests():
    random.seed(33)
    out = [fmt(5, [3, 2, 5]), fmt(1, [1]), fmt(4, [1, 4, 2, 3])]
    for n in (2, 3, 6, 10, 40, 300):
        p = list(range(1, n + 1))
        random.shuffle(p)
        out.append(fmt(n, p))
        out.append(fmt(n, p[:random.randint(1, n)]))
    out.append(fmt(8, list(range(8, 0, -1))))
    out.append(fmt(8, [4, 5, 3, 6, 2, 7, 1, 8]))
    n = 30000
    p = list(range(1, n + 1))
    random.shuffle(p)
    out.append(fmt(n, p))
    m = 12000
    out.append(fmt(m, list(range(m // 2, 0, -1)) + list(range(m // 2 + 1, m + 1))))
    out.append(fmt(100000, list(range(100000, 0, -9))))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, q = d[0], d[1]
    if n > 5000:
        return None
    row = list(range(1, n + 1))
    res = []
    for x in d[2:2 + q]:
        i = row.index(x)
        l = row[i - 1] if i else 0
        r = row[i + 1] if i + 1 < len(row) else 0
        res.append(f'{l} {r}')
        row.pop(i)
    return '\n'.join(res)
