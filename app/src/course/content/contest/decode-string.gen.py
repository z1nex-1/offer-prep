import random
import re

LET = 'abcdefghijklmnopqrstuvwxyz'


def rand_enc(budget, depth):
    parts, size = [], 0
    while size < budget:
        if depth < 6 and random.random() < 0.35 and budget - size >= 2:
            k = random.randint(1, 4)
            inner, isz = rand_enc(max(1, (budget - size) // (k * 2)), depth + 1)
            parts.append(f'{k}[{inner}]')
            size += k * isz
        else:
            n = random.randint(1, 3)
            parts.append(''.join(random.choice('abc') for _ in range(n)))
            size += n
    return ''.join(parts), size


def tests():
    random.seed(207)
    out = ['3[a2[c]]\n', '2[ab]3[x]y\n', 'abc\n', '12[z]\n', '1[a]\n', 'x1[y]z\n',
           '300[q]\n', '2[a2[b2[c]]]\n', '3[2[a]b]\n', 'ab2[c]de10[f]\n']
    for budget in (5, 15, 40, 120, 500):
        for _ in range(2):
            out.append(rand_enc(budget, 0)[0] + '\n')
    for budget in (3000, 20000, 90000):
        s, size = rand_enc(budget, 0)
        while size > 100000:
            s, size = rand_enc(budget, 0)
        out.append(s + '\n')
    d = 30000
    out.append('1[' * d + 'a' + ']' * d + '\n')
    out.append('2[' * 15 + 'ab' + ']' * 15 + 'c\n')
    body = ''.join(random.choice(LET) for _ in range(1000))
    out.append('100[' + body + ']\n')
    out.append('b' + '1[' * 20000 + 'xy' + ']' * 20000 + '99[k]\n')
    return out


def brute(inp):
    s = inp.strip()
    if len(s) > 5000:
        return None
    pat = re.compile(r'(\d+)\[([a-z]*)\]')
    while '[' in s:
        s = pat.sub(lambda m: m.group(2) * int(m.group(1)), s)
    return s
