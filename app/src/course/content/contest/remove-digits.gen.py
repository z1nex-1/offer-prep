import random
from itertools import combinations


def make(num, k):
    return f'{num}\n{k}\n'


def rnd_num(n, digits='0123456789'):
    return random.choice('123456789') + ''.join(random.choice(digits) for _ in range(n - 1))


def tests():
    random.seed(89)
    out = [make('1432219', 3), make('10200', 1), make('12345', 2), make('10', 2), make('0', 0),
           make('9', 1), make('100000', 1), make('112', 1), make('10001', 4), make('987654', 3)]
    for n in (3, 5, 8, 10, 12):
        for digits in ('0123456789', '019', '12'):
            num = rnd_num(n, digits)
            out.append(make(num, random.randint(0, n)))
    n = 10**5
    out.append(make(rnd_num(n), n // 2))
    out.append(make('1' * 50000 + '98765432' * 6250, 40000))
    out.append(make(''.join(sorted(rnd_num(n, '123456789'))), 30000))
    out.append(make('9' + '0' * (n - 1), 1))
    out.append(make(rnd_num(n, '09'), n - 3))
    return out


def brute(inp):
    data = inp.split()
    num, k = data[0], int(data[1])
    n = len(num)
    if n > 12:
        return None
    best = None
    for keep in combinations(range(n), n - k):
        v = int(''.join(num[i] for i in keep) or '0')
        if best is None or v < best:
            best = v
    return best
