import random


def rnd(n, weights):
    ops = 'a<>#^$'
    out = []
    for _ in range(n):
        c = random.choices(ops, weights)[0]
        out.append(random.choice('abcxyz') if c == 'a' else c)
    return ''.join(out)


def tests():
    random.seed(1968)
    out = ['ab<c\n', 'abc^x$y\n', 'ab##c<<#d\n', '<<>>#\n', 'a#\n', 'hello^^world\n', 'abc<<<#>>>>#\n', 'z^y^x^w$v\n']
    for n in (5, 10, 30, 100, 1000):
        for w in ((5, 2, 2, 1, 1, 1), (3, 3, 1, 2, 1, 1), (4, 1, 1, 1, 2, 0), (2, 1, 1, 3, 0, 1)):
            out.append(rnd(n, w) + '\n')
    m = 60000
    out.append('a' * 1000 + ''.join('^' + random.choice('abc') for _ in range(m)) + '\n')
    out.append(''.join(random.choice('xyz') for _ in range(m)) + ''.join(random.choice('<^') + random.choice('ab') for _ in range(m)) + '\n')
    out.append(rnd(200000, (6, 3, 3, 2, 1, 1)) + '\n')
    out.append('q' * 100000 + '#' * 100001 + 'r\n')
    return out


def brute(inp):
    s = inp.strip()
    if len(s) > 5000:
        return None
    text, pos = [], 0
    for c in s:
        if c == '<':
            pos = max(0, pos - 1)
        elif c == '>':
            pos = min(len(text), pos + 1)
        elif c == '#':
            if pos:
                del text[pos - 1]
                pos -= 1
        elif c == '^':
            pos = 0
        elif c == '$':
            pos = len(text)
        else:
            text.insert(pos, c)
            pos += 1
    return ''.join(text) or 'empty'
