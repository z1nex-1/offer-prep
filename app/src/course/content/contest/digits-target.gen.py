import random
from itertools import product


def tests():
    random.seed(3)
    out = ['123\n6\n', '1111\n0\n', '5\n5\n', '5\n-5\n', '12\n12\n', '999\n-9\n', '123456789\n100\n',
           '11111111111\n11111111111\n', '11111111111\n1\n', '98765432198\n0\n']
    for n in (6, 9, 11, 11, 11):
        s = ''.join(random.choice('123456789') for _ in range(n))
        out.append(f'{s}\n{random.randint(-50, 150)}\n')
    out.append('12121212121\n12\n')
    return out


def brute(inp):
    s, t = inp.split()
    t = int(t)
    n = len(s)
    res = 0
    for ops in product(['+', '-', ''], repeat=n - 1):
        expr = s[0] + ''.join(o + d for o, d in zip(ops, s[1:]))
        res += eval(expr) == t
    return res
