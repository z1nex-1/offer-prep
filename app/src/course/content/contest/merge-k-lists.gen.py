import random


def fmt(lists):
    return f"{len(lists)}\n" + '\n'.join(' '.join(map(str, [len(l)] + l)) for l in lists) + '\n'


def tests():
    random.seed(113)
    out = [fmt([[1, 4, 5], [1, 3, 4], [2, 6]]), fmt([[]]), fmt([[], [5], []]), fmt([[1, 1], [1]])]
    for k, m in ((3, 5), (10, 8), (50, 20)):
        out.append(fmt([sorted(random.randint(-30, 30) for _ in range(random.randint(0, m))) for _ in range(k)]))
    out.append(fmt([sorted(random.randint(-10 ** 9, 10 ** 9) for _ in range(random.randint(0, 20))) for _ in range(3000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    k, pos, allv = d[0], 1, []
    for _ in range(k):
        m = d[pos]
        allv += d[pos + 1:pos + 1 + m]
        pos += 1 + m
    return ' '.join(map(str, sorted(allv)))
