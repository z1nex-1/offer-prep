import random
import sys

sys.setrecursionlimit(10000)


def build(depth, budget):
    items = []
    for _ in range(random.randint(0, 4)):
        if depth < 100 and random.random() < 0.35 and budget[0] > 0:
            budget[0] -= 1
            items.append(build(depth + 1, budget))
        else:
            items.append(random.randint(-10**9, 10**9))
    return items


def enc(x):
    return str(x) if isinstance(x, int) else '[' + ','.join(enc(y) for y in x) + ']'


def deep(d):
    x = [d]
    for i in range(d - 1):
        x = [i - 50, x, -i]
    return x


def tests():
    random.seed(11)
    out = ['[1,[2,[3,-4]],5]', '[[1,1],2,[1,1]]', '[]', '[[]]', '[-7]', '[[[[[[5]]]]]]', '[0,[0],[[0]]]',
           enc(deep(100)), '[' + ','.join(['1000000000'] * 20000) + ']']
    for size in (5, 50, 2000, 12000):
        out.append(enc(build(1, [size])))
    x = []
    while len(enc(x)) < 190000:
        x.append(build(2, [30]))
    out.append(enc(x))
    return [t + '\n' for t in out]


def brute(inp):
    def walk(x, d):
        return x * d if isinstance(x, int) else sum(walk(y, d + 1) for y in x)
    return walk(eval(inp), 0)
