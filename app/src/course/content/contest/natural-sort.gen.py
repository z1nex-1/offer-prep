import random
from functools import cmp_to_key


def make(names):
    return f'{len(names)}\n' + '\n'.join(names) + '\n'


def rnd_name(maxlen, alpha='ab.', digits='0129'):
    s = ''
    ln = random.randint(1, maxlen)
    while len(s) < ln:
        if random.random() < 0.5:
            s += ''.join(random.choice(digits) for _ in range(random.randint(1, 3)))
        else:
            s += ''.join(random.choice(alpha) for _ in range(random.randint(1, 3)))
    return s[:ln]


def tests():
    random.seed(63)
    out = [make(['file10.txt', 'file2.txt', 'file1.txt', 'file02.txt', 'file.txt']),
           make(['a1', '1a', 'a', '10', '9', 'a01', 'a1b']),
           make(['x']), make(['007', '7', '07', '7']), make(['v1.10', 'v1.9', 'v1.9.1', 'v1.1', 'v10']),
           make(['img_1', 'img-1', 'img1', 'img.1']),
           make(['a' + '9' * 29, 'a' + '1' + '0' * 28, 'a' + '0' * 29, 'a0'])]
    for n, ln in ((5, 4), (8, 6), (10, 8), (20, 10)):
        for _ in range(3):
            out.append(make([rnd_name(ln) for _ in range(n)]))
    n = 10000
    out.append(make([rnd_name(30, 'abcxyz._-', '0123456789') for _ in range(n)]))
    out.append(make(['photo_' + str(random.randint(0, 10**6)).zfill(random.randint(1, 8)) + random.choice(['.jpg', '.png', '', 'b.jpg']) for _ in range(n)]))
    return out


def pieces(s):
    res, i = [], 0
    while i < len(s):
        j = i
        dig = s[i].isdigit()
        while j < len(s) and s[j].isdigit() == dig:
            j += 1
        res.append((dig, s[i:j]))
        i = j
    return res


def cmp_piece(p, q):
    if p[0] != q[0]:
        return -1 if p[0] else 1
    if p[0]:
        a, b = p[1].lstrip('0'), q[1].lstrip('0')
        if len(a) != len(b):
            return -1 if len(a) < len(b) else 1
        if a != b:
            return -1 if a < b else 1
        return len(p[1]) - len(q[1])
    return (p[1] > q[1]) - (p[1] < q[1])


def cmp(x, y):
    px, py = pieces(x), pieces(y)
    for p, q in zip(px, py):
        c = cmp_piece(p, q)
        if c:
            return c
    return len(px) - len(py)


def brute(inp):
    names = inp.split()[1:]
    return '\n'.join(sorted(names, key=cmp_to_key(cmp)))
