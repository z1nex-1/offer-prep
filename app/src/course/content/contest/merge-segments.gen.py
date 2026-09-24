import random


def fmt(s):
    return f"{len(s)}\n" + '\n'.join(f'{l} {r}' for l, r in s) + '\n'


def tests():
    random.seed(32)
    out = [fmt([(1, 3), (2, 6), (8, 10), (15, 18)]), fmt([(1, 4), (4, 5)]), fmt([(1, 10), (2, 3)]), fmt([(5, 5)]), fmt([(1, 2), (3, 4)])]
    for n in (6, 20, 100):
        s = []
        for _ in range(n):
            l = random.randint(-30, 30)
            s.append((l, l + random.randint(0, 6)))
        out.append(fmt(s))
    s = []
    for _ in range(30000):
        l = random.randint(-10 ** 9, 10 ** 9 - 10 ** 5)
        s.append((l, l + random.randint(0, 10 ** 5)))
    out.append(fmt(s))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    segs = [[d[1 + 2 * i], d[2 + 2 * i]] for i in range(d[0])]
    changed = True
    while changed:
        changed = False
        for i in range(len(segs)):
            for j in range(i + 1, len(segs)):
                a, b = segs[i], segs[j]
                if max(a[0], b[0]) <= min(a[1], b[1]):
                    segs[i] = [min(a[0], b[0]), max(a[1], b[1])]
                    segs.pop(j)
                    changed = True
                    break
            if changed:
                break
    segs.sort()
    return '\n'.join([str(len(segs))] + [f'{l} {r}' for l, r in segs])
