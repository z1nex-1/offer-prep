import random


def fmt(s):
    return f"{len(s)}\n" + '\n'.join(f'{a} {b}' for a, b in s) + '\n'


def tests():
    random.seed(41)
    out = [fmt([(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11), (8, 12), (2, 14), (12, 16)]), fmt([(0, 10)]), fmt([(1, 2), (2, 3), (3, 4)]), fmt([(0, 100), (1, 2), (3, 4), (5, 6)])]
    for n in (5, 9, 12):
        s = []
        for _ in range(n):
            a = random.randint(0, 20)
            s.append((a, a + random.randint(1, 6)))
        out.append(fmt(s))
    s = []
    for _ in range(40000):
        a = random.randint(0, 10 ** 9 - 10 ** 6)
        s.append((a, a + random.randint(1, 10 ** 6)))
    out.append(fmt(s))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    s = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(d[0])]
    if len(s) > 14:
        return None
    best = 0
    for mask in range(1 << len(s)):
        ch = sorted(s[i] for i in range(len(s)) if mask >> i & 1)
        if all(ch[k][1] <= ch[k + 1][0] for k in range(len(ch) - 1)):
            best = max(best, len(ch))
    return best
