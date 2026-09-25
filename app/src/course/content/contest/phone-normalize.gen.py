import random


def rnd_phone():
    d = ''.join(random.choice('0123456789') for _ in range(10))
    kind = random.randrange(9)
    if kind == 0:
        return f'+7 ({d[:3]}) {d[3:6]}-{d[6:8]}-{d[8:]}'
    if kind == 1:
        return f'8-{d[:3]}-{d[3:6]}-{d[6:8]}-{d[8:]}'
    if kind == 2:
        return d
    if kind == 3:
        return f'+7{d[:3]} {d[3:]}'
    if kind == 4:
        return f'7{d}'
    if kind == 5:
        return random.choice(['+8' + d, '+7' + d[:9], d + '1', '8' + d + '5', '+7' + d + '0'])
    if kind == 6:
        return random.choice([d[:5] + '+' + d[5:], d[:4] + '.' + d[4:], 'tel:' + d, d[:3] + '_' + d[3:]])
    if kind == 7:
        return random.choice(['', '   ', '()', '+', '+7', '-'])
    return f'({d[:3]}) {d[3:6]} {d[6:]}'


def tests():
    random.seed(160)
    out = ['4\n+7 (916) 123-45-67\n8-916-123-45-67\n9161234567\n+7916 1234567\n',
           '6\n+8 916 123 45 67\n\n12345\n7 916 123 45 67\n+7 916 123 45 6a\n916+1234567\n',
           '3\n79161234567\n89161234567\n69161234567\n']
    for n in (20, 100):
        out.append(f'{n}\n' + '\n'.join(rnd_phone() for _ in range(n)) + '\n')
    out.append('30000\n' + '\n'.join(rnd_phone() for _ in range(30000)) + '\n')
    return out


def brute(inp):
    import re
    lines = inp.split('\n')
    n = int(lines[0])
    rows = lines[1:1 + n]
    rows += [''] * (n - len(rows))
    res = []
    for r in rows:
        s = re.sub(r'[ ()\-]', '', r)
        m = re.fullmatch(r'\+7(\d{10})|[78](\d{10})|(\d{10})', s)
        if not m:
            res.append('error')
        else:
            res.append('+7' + next(g for g in m.groups() if g is not None))
    return '\n'.join(res)
