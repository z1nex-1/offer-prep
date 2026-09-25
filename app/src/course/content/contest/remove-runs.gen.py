import random

LET = 'abcdefghijklmnopqrstuvwxyz'


def fmt(s, k):
    return f'{len(s)} {k}\n{s}\n'


def nested(layers, k, alphabet='abc'):
    c = random.choice(alphabet)
    s = c * k
    for _ in range(layers):
        c = random.choice([x for x in alphabet if x != c])
        j = random.randint(1, k - 1)
        s = c * j + s + c * (k - j)
    return s


def rand_tail(m, k):
    out, prev = [], ''
    while len(out) < m:
        c = random.choice([x for x in LET if x != prev])
        out.extend(c * random.randint(1, k - 1))
        prev = c
    return ''.join(out[:m])


def tests():
    random.seed(1209)
    out = [fmt('abbbacca', 3), fmt('deeedbbcccbdaa', 3), fmt('abccba', 2),
           fmt('aa', 2), fmt('ab', 2), fmt('aaaa', 3), fmt('aaaaaa', 3), fmt('xyyyxx', 3), fmt('abcabc', 2)]
    for n in (5, 8, 12, 20, 40, 100, 400):
        for alpha in ('ab', 'abc'):
            k = random.randint(2, 4)
            n2 = max(n, k)
            out.append(fmt(''.join(random.choice(alpha) for _ in range(n2)), k))
    for k in (2, 3, 5):
        out.append(fmt(nested(30, k), k))
        out.append(fmt(rand_tail(50, k) + nested(250, k) + rand_tail(50, k), k))
    out.append(fmt(nested(49999, 2), 2))
    out.append(fmt(rand_tail(300, 3) + nested(32500, 3) + rand_tail(1000, 3), 3))
    s = nested(9000, 10, 'abcd')
    out.append(fmt('z' + s + 'y', 10))
    out.append(fmt(''.join(random.choice('ab') for _ in range(100000)), 2))
    out.append(fmt(''.join(random.choice('abc') for _ in range(100000)), 3))
    out.append(fmt('a' * 99999, 99999))
    out.append(fmt('ab' * 20000 + 'b' * 9999 + 'a' * 29999, 30000))
    return out


def brute(inp):
    lines = inp.split()
    k, s = int(lines[1]), lines[2]
    if len(s) > 3000:
        return None
    changed = True
    while changed:
        changed = False
        i = 0
        while i < len(s):
            j = i
            while j < len(s) and s[j] == s[i]:
                j += 1
            if j - i >= k:
                s = s[:i] + s[i + k:]
                changed = True
                break
            i = j
    return s or 'empty'
