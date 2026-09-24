import random
from fractions import Fraction


def pack(a):
    return f'{len(a)}\n' + ' '.join(map(str, a)) + '\n'


def tests():
    random.seed(21)
    out = [pack([2, 3]), pack([1, 1, 2]), pack([0, 0, 0, 0, 0, 0, 0, 1]), pack([107] + [0] * 39), pack([5]), pack([0]), pack([1, 2]),
           pack([10**15] * 3 + [1]), pack([3] + [0] * 7), pack([1] + [0] * 199), pack([10**15, 10**15 - 1])]
    for n in (3, 8, 40, 200):
        out.append(pack([random.randint(0, 100) for _ in range(n)]))
    for n in (16, 1000, 10000):
        out.append(pack([random.randint(0, 10**15) for _ in range(n)]))
    return out


def brute(inp):
    d = inp.split()
    n = int(d[0])
    avg = Fraction(sum(map(int, d[1:1 + n])), n)
    hundredths = avg * 100
    x = int(hundredths)
    if hundredths - x >= Fraction(1, 2):
        x += 1
    return f'{x // 100}.{x % 100:02d}'
