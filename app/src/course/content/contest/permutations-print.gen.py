import random
import string


def tests():
    random.seed(25)
    out = ['abc\n', 'ba\n', 'z\n', 'dcba\n', 'qwe\n']
    for n in (5, 6, 7, 8):
        out.append(''.join(random.sample(string.ascii_lowercase, n)) + '\n')
    return out


def brute(inp):
    s = inp.strip()
    res = ['']
    for _ in range(len(s)):
        res = [p + c for p in res for c in s if c not in p]
    return '\n'.join(sorted(res))
