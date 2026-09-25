import random

DIG = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'


def num(base, length):
    return DIG[random.randint(1, base - 1)] + ''.join(DIG[random.randrange(base)] for _ in range(length - 1))


def tests():
    random.seed(141)
    out = ['10 2\n13\n', '16 10\nFF\n', '2 16\n0\n', '36 10\nZ\n', '10 36\n35\n', '7 7\n654\n']
    for _ in range(4):
        a, b = random.randint(2, 36), random.randint(2, 36)
        out.append(f'{a} {b}\n{num(a, random.randint(1, 12))}\n')
    out.append(f'36 3\n{num(36, 1000)}\n')
    out.append(f'2 10\n{num(2, 1000)}\n')
    return out


def brute(inp):
    lines = inp.split('\n')
    a, b = map(int, lines[0].split())
    s = lines[1].strip()
    digs = [0]
    for ch in s:
        v = DIG.index(ch)
        carry = v
        for i in range(len(digs)):
            carry += digs[i] * a
            digs[i] = carry % b
            carry //= b
        while carry:
            digs.append(carry % b)
            carry //= b
    while len(digs) > 1 and digs[-1] == 0:
        digs.pop()
    return ''.join(DIG[d] for d in reversed(digs))
