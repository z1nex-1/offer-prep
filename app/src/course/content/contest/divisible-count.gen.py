import random


def tests():
    random.seed(32)
    out = ['10 2 3\n', '100 4 6\n', '1 1 1\n', '5 7 8\n', '12 12 12\n', '1000000000000000000 1 1\n', '1000000000000000000 999999999999999999 1000000000000000000\n',
           '1000000000000000000 2 1000000000000000000\n', '1000000000000000000 1000000007 998244353\n', '30 6 10\n']
    for _ in range(12):
        out.append(f'{random.randint(1, 500)} {random.randint(1, 30)} {random.randint(1, 30)}\n')
    for _ in range(4):
        out.append(f'{random.randint(1, 10**18)} {random.randint(1, 10**6)} {random.randint(1, 10**6)}\n')
    return out


def brute(inp):
    n, a, b = map(int, inp.split())
    if n > 10**4:
        return None
    return str(sum(1 for x in range(1, n + 1) if x % a == 0 or x % b == 0))
