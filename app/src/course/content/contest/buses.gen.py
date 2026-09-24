import random


def tests():
    random.seed(2)
    out = ['25 10\n', '30 10\n', '1 1\n', '1 1000000000000000000\n', '1000000000000000000 1\n',
           '1000000000000000001 1\n', '999999999999999999 1000000000000000000\n', '1000000000000000000 3\n', '7 2\n']
    for _ in range(8):
        out.append(f'{random.randint(1, 100)} {random.randint(1, 30)}\n')
    for _ in range(5):
        out.append(f'{random.randint(1, 10**18)} {random.randint(1, 10**9)}\n')
    return out


def brute(inp):
    n, k = map(int, inp.split())
    if n > 10**6 or n // k > 10**5:
        return None
    buses, left = 0, n
    while left > 0:
        buses += 1
        left -= k
    return f'{buses} {-left}'
