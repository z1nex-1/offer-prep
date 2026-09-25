import random


def fmt(words, queries):
    return f'{len(words)} {len(queries)}\n' + ''.join(w + '\n' for w in words) + ''.join(x + '\n' for x in queries)


def word(lo, hi, alpha):
    return ''.join(random.choice(alpha) for _ in range(random.randint(lo, hi)))


def tests():
    random.seed(88)
    out = [fmt(['apple', 'app', 'apply', 'banana', 'app'], ['app', 'appl', 'b', 'c', 'apple', 'applesauce']),
           fmt(['a'], ['a', 'aa', 'b']),
           fmt(['abc', 'abd', 'ab', 'a'], ['a', 'ab', 'abc', 'abd', 'abe', 'b'])]
    for n, q, hi, alpha in ((20, 20, 4, 'ab'), (200, 200, 6, 'abc'), (5000, 5000, 8, 'abcd')):
        ws = [word(1, hi, alpha) for _ in range(n)]
        qs = [random.choice(ws)[:random.randint(1, hi)] if random.random() < 0.7 else word(1, hi, alpha) for _ in range(q)]
        out.append(fmt(ws, qs))
    ws = [word(1, 10, 'abcdefghijklmnopqrstuvwxyz') for _ in range(15000)]
    qs = [random.choice(ws)[:random.randint(1, 5)] for _ in range(15000)]
    out.append(fmt(ws, qs))
    long = 'a' * 40000
    ws = [long, long[:20000] + 'b', 'a' * 10]
    qs = ['a' * k for k in (1, 10, 11, 20000, 20001, 39999, 40000)] + ['a' * 20000 + 'b', 'b']
    out.append(fmt(ws, qs))
    ws = ['z' * random.randint(1, 30) for _ in range(6000)]
    qs = ['z' * random.randint(1, 35) for _ in range(6000)]
    out.append(fmt(ws, qs))
    return out


def brute(inp):
    d = inp.split()
    n, q = int(d[0]), int(d[1])
    ws, qs = d[2:2 + n], d[2 + n:]
    return '\n'.join(str(sum(w.startswith(p) for w in ws)) for p in qs)
