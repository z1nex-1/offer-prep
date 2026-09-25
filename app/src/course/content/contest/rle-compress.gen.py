import random


def tests():
    random.seed(151)
    out = ['AAABCCDDDD\n', 'A\n', 'ABC\n', 'ZZZZZZZZZZZZ\n', 'ABBA\n']
    for n in (10, 40):
        out.append(''.join(random.choice('AB') for _ in range(n)) + '\n')
    s = []
    while len(s) < 150000:
        s.extend(random.choice('XYZ') * random.randint(1, 30))
    out.append(''.join(s) + '\n')
    out.append('Q' * 200000 + '\n')
    return out


def brute(inp):
    from itertools import groupby
    s = inp.strip()
    res = ''
    for ch, g in groupby(s):
        k = len(list(g))
        res += ch + (str(k) if k > 1 else '')
    return res
