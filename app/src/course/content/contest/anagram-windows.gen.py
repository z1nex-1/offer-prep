import random


def tests():
    random.seed(153)
    out = ['cbaebabacd\nabc\n', 'abab\nab\n', 'aaaa\nb\n', 'a\na\n', 'abc\nabcd\n'.replace('abc\nabcd', 'abcd\nabcd')]
    for n, m in ((12, 2), (30, 3), (60, 5)):
        s = ''.join(random.choice('ab') for _ in range(n))
        p = ''.join(random.choice('ab') for _ in range(m))
        out.append(f'{s}\n{p}\n')
    s = ''.join(random.choice('abc') for _ in range(100000))
    out.append(f'{s}\n{"abcabcabca"}\n')
    s = ''.join(random.choice('abcdefghijklmnopqrstuvwxyz') for _ in range(100000))
    out.append(f'{s}\n{s[500:30500]}\n')
    return out


def brute(inp):
    s, p = inp.split()
    n, m = len(s), len(p)
    if n * m > 20000:
        return None
    sp = sorted(p)
    res = [i + 1 for i in range(n - m + 1) if sorted(s[i:i + m]) == sp]
    return f"{len(res)}\n{' '.join(map(str, res))}"
