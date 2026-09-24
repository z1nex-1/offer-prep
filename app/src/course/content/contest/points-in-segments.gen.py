import random


def fmt(segs, pts):
    return f"{len(segs)} {len(pts)}\n" + '\n'.join(f'{a} {b}' for a, b in segs) + '\n' + ' '.join(map(str, pts)) + '\n'


def tests():
    random.seed(34)
    out = [fmt([(0, 5), (7, 10)], [1, 6, 11]), fmt([(-10, 10)], [-100, 100, 0]), fmt([(5, 0), (0, 5)], [0, 5, 6]), fmt([(3, 3)], [3, 2])]
    for n, m in ((5, 5), (20, 30), (100, 100)):
        segs = [(random.randint(-20, 20), random.randint(-20, 20)) for _ in range(n)]
        out.append(fmt(segs, [random.randint(-25, 25) for _ in range(m)]))
    segs = [(random.randint(-10 ** 9, 10 ** 9), random.randint(-10 ** 9, 10 ** 9)) for _ in range(20000)]
    out.append(fmt(segs, [random.randint(-10 ** 9, 10 ** 9) for _ in range(20000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n, m = d[0], d[1]
    segs = [(min(d[2 + 2 * i], d[3 + 2 * i]), max(d[2 + 2 * i], d[3 + 2 * i])) for i in range(n)]
    pts = d[2 + 2 * n:]
    return ' '.join(str(sum(1 for a, b in segs if a <= x <= b)) for x in pts)
