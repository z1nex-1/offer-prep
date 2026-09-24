import random


def pack(p):
    return f'{len(p)}\n' + '\n'.join(f'{x} {y}' for x, y in p) + '\n'


def tests():
    random.seed(53)
    out = [pack([(1, 1), (2, 2), (3, 3), (4, 1), (0, 5)]), pack([(0, 0), (1, 1), (0, 0), (2, 3)]), pack([(5, 5)]), pack([(1, 2), (1, 2), (1, 2)]),
           pack([(0, 0), (0, 5), (0, -3), (1, 1)]), pack([(0, 0), (1, -2), (-1, 2), (2, -4), (3, 3)]),
           pack([(0, 0), (1000000000, 999999999), (999999999, 999999998)]),
           pack([(-10**9, -10**9), (10**9, 10**9), (0, 0), (1, 1), (10**9, -10**9)])]
    for n, c in ((6, 3), (10, 3), (20, 5), (40, 4), (60, 10)):
        for _ in range(2):
            out.append(pack([(random.randint(-c, c), random.randint(-c, c)) for _ in range(n)]))
    pts = [(random.randint(-10**9, 10**9), random.randint(-10**9, 10**9)) for _ in range(640)]
    x0, y0, dx, dy = 7, -3, 123457, 99991
    pts += [(x0 + k * dx, y0 + k * dy) for k in range(-30, 30)]
    random.shuffle(pts)
    out.append(pack(pts))
    pts = [(random.randint(-20, 20), random.randint(-20, 20)) for _ in range(700)]
    out.append(pack(pts))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    n = d[0]
    p = [(d[1 + 2 * i], d[2 + 2 * i]) for i in range(n)]
    if n > 60:
        return None
    best = 1
    for i in range(n):
        for j in range(n):
            if p[i] == p[j]:
                continue
            cnt = 0
            for k in range(n):
                if (p[j][0] - p[i][0]) * (p[k][1] - p[i][1]) == (p[j][1] - p[i][1]) * (p[k][0] - p[i][0]):
                    cnt += 1
            best = max(best, cnt)
    if best == 1:
        best = max(p.count(q) for q in p)
    return str(best)
