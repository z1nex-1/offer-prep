import random


def t(x):
    return f"{x // 3600:02d}:{x // 60 % 60:02d}:{x % 60:02d}"


def fmt(pairs):
    return f"{len(pairs)}\n" + '\n'.join(f'{t(a)} {t(b)}' for a, b in pairs) + '\n'


def tests():
    random.seed(131)
    out = [
        '3\n09:00:00 10:30:00\n23:50:00 00:10:00\n12:00:00 12:00:00\n',
        '1\n00:00:01 00:00:00\n',
        '2\n10:00:00 11:00:00\n22:00:00 23:00:00\n',
        '1\n23:59:59 00:00:00\n',
    ]
    for n in (3, 6, 10):
        out.append(fmt([(random.randrange(86400), random.randrange(86400)) for _ in range(n)]))
    out.append(fmt([(random.randrange(86400), random.randrange(86400)) for _ in range(30000)]))
    return out


def brute(inp):
    lines = inp.split('\n')
    n = int(lines[0])
    if n > 10:
        return None
    def sec(x):
        h, m, s = map(int, x.split(':'))
        return h * 3600 + m * 60 + s
    total = 0
    durs = []
    for i in range(n):
        a, b = lines[1 + i].split()
        a, b = sec(a), sec(b)
        d = 0
        cur = a
        while cur != b:
            cur = (cur + 1) % 86400
            d += 1
        durs.append(d)
        total += d
    best = durs.index(max(durs)) + 1
    return f"{total // 3600}:{total // 60 % 60:02d}:{total % 60:02d}\n{best}"
