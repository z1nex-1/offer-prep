import random


def fmt(s, qs):
    return f"{s}\n{len(qs)}\n" + '\n'.join(' '.join(map(str, x)) for x in qs) + '\n'


def rq(n, maxlen):
    ln = random.randint(1, min(n, maxlen))
    a = random.randint(1, n - ln + 1)
    b = random.randint(1, n - ln + 1)
    return (a, a + ln - 1, b, b + ln - 1)


def tests():
    random.seed(158)
    out = [fmt('abacaba', [(1, 3, 5, 7), (1, 1, 7, 7), (2, 3, 4, 5), (1, 7, 1, 7)]), fmt('a', [(1, 1, 1, 1)])]
    for n in (10, 50):
        s = ''.join(random.choice('ab') for _ in range(n))
        out.append(fmt(s, [rq(n, 5) for _ in range(40)]))
    n = 100000
    s = ''.join('a' if random.random() > 0.00005 else 'b' for _ in range(n))
    qs = []
    for _ in range(16000):
        ln = random.randint(40000, 50000)
        a = random.randint(1, n - ln + 1)
        b = random.randint(1, n - ln + 1)
        qs.append((a, a + ln - 1, b, b + ln - 1))
    out.append(fmt(s, qs))
    s = ''.join(random.choice('abc') for _ in range(n))
    base = s[:1000]
    s = (base * 100)[:n]
    qs = []
    for _ in range(12000):
        ln = random.randint(1, 30000)
        a = random.randint(1, n - ln + 1)
        b = a + 1000 * random.randint(-3, 3) + random.choice([0, 0, 1])
        b = min(max(b, 1), n - ln + 1)
        qs.append((a, a + ln - 1, b, b + ln - 1))
    out.append(fmt(s, qs))
    return out


def brute(inp):
    d = inp.split()
    s = d[0]
    q = int(d[1])
    if len(s) > 1000:
        return None
    res = []
    for i in range(q):
        l1, r1, l2, r2 = map(int, d[2 + 4 * i:6 + 4 * i])
        res.append('Yes' if s[l1 - 1:r1] == s[l2 - 1:r2] else 'No')
    return '\n'.join(res)
