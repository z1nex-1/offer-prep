import itertools
import random


def tests():
    random.seed(3)
    out = ['3 4 5\n', '2 2 2\n', '1 2 3\n', '5 3 4\n', '2 3 4\n', '1 1 1000000000\n', '1000000000 1000000000 1000000000\n',
           '999999999 999999999 1\n', '1 1 1\n', '6 8 10\n', '20 21 29\n', '20 29 21\n']
    for p, q in [(99999, 1), (70000, 30001)]:
        a, b, c = p * p - q * q, 2 * p * q, p * p + q * q
        out.append(f'{c} {a} {b}\n')
        out.append(f'{c + 1} {a} {b}\n')
        out.append(f'{c - 1} {a} {b}\n')
    for _ in range(10):
        out.append(' '.join(str(random.randint(1, 20)) for _ in range(3)) + '\n')
    return out


def brute(inp):
    s = list(map(int, inp.split()))
    for x, y, z in itertools.permutations(s):
        if x + y <= z:
            return 'impossible'
    d = [y * y + z * z - x * x for x, y, z in itertools.permutations(s)]
    if min(d) < 0:
        return 'obtuse'
    if min(d) == 0:
        return 'right'
    return 'acute'
