import random


def tests():
    random.seed(4)
    out = ['9875\n', '0\n', '9\n', '10\n', '99999999999\n', '1' + '0' * 99999 + '\n', '9' * 100000 + '\n']
    for n in (3, 10, 50, 1000, 5000):
        out.append(str(random.randint(1, 9)) + ''.join(random.choice('0123456789') for _ in range(n - 1)) + '\n')
    out.append('8' + ''.join(random.choice('0123456789') for _ in range(99999)) + '\n')
    return out


def brute(inp):
    n = int(inp.strip())
    while n >= 10:
        n = sum(int(c) for c in str(n))
    return str(n)
