import random


def tests():
    random.seed(9)
    out = ['10 3 2\n', '5 5 7\n', '10 2 3\n', '1 1 0\n', '10 3 3\n', '11 5 1\n', '12 5 1\n', '13 5 1\n',
           '1000000000000000000 2 1\n', '1000000000000000000 1000000000000000000 0\n', '1000000000000000000 999999999999999999 999999999999999998\n',
           '1000000000000000000 3 0\n', '1000000000000000000 1 1000000000000000000\n']
    for _ in range(40):
        out.append(f'{random.randint(1, 30)} {random.randint(1, 8)} {random.randint(0, 8)}\n')
    for _ in range(5):
        a = random.randint(2, 10**12)
        out.append(f'{random.randint(1, 10**18)} {a} {random.randint(0, a - 1)}\n')
    return out


def brute(inp):
    h, a, b = map(int, inp.split())
    if max(h, a, b) > 1000:
        return None
    pos = 0
    for day in range(1, 3000):
        pos += a
        if pos >= h:
            return str(day)
        pos -= b
    return '-1'
