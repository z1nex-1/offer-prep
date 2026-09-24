import random
import string


def fmt(rows):
    return f"{len(rows)}\n" + '\n'.join(f'{a} {b} {c}' for a, b, c in rows) + '\n'


def tests():
    random.seed(36)
    out = [fmt([('ann', 3, 50), ('bob', 5, 100), ('cat', 3, 20), ('dan', 3, 20)]), fmt([('solo', 0, 0)]), fmt([('b', 10, 5), ('a', 9, 1)])]
    for n in (6, 30, 200):
        rows = [(''.join(random.choice('abc') for _ in range(3)), random.randint(0, 3), random.randint(0, 5)) for _ in range(n)]
        out.append(fmt(rows))
    rows = [(''.join(random.choice(string.ascii_lowercase) for _ in range(6)), random.randint(0, 15), random.randint(0, 10 ** 6)) for _ in range(30000)]
    out.append(fmt(rows))
    return out


def brute(inp):
    d = inp.split()
    n = int(d[0])
    rows = [(d[1 + 3 * i], int(d[2 + 3 * i]), int(d[3 + 3 * i])) for i in range(n)]
    rows.sort(key=lambda r: r[0])
    rows.sort(key=lambda r: r[2])
    rows.sort(key=lambda r: r[1], reverse=True)
    return '\n'.join(r[0] for r in rows)
