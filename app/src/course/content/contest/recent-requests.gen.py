import random


def pack(a):
    return f'{len(a)}\n' + ' '.join(map(str, a)) + '\n'


def walk(n, step):
    t, a = 0, []
    for _ in range(n):
        t += random.randint(1, step)
        a.append(t)
    return a


def tests():
    random.seed(23)
    out = [pack([1, 100, 3001, 3002]), pack([5]), pack([1, 3001, 3002, 6002, 6003]), pack([1000, 4000, 4001, 7001, 7002, 7003]),
           pack(list(range(1, 11)))]
    for n, step in ((20, 1500), (100, 300), (1000, 50), (1000, 4000)):
        out.append(pack(walk(n, step)))
    out.append(pack(walk(30000, 60)))
    out.append(pack(list(range(1, 25001)) + [10**9 - 4999 + i for i in range(5000)]))
    return out


def brute(inp):
    d = list(map(int, inp.split()))
    a = d[1:]
    return ' '.join(str(sum(1 for s in a[:i + 1] if s >= t - 3000)) for i, t in enumerate(a))
