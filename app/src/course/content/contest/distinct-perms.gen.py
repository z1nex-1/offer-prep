from itertools import permutations
from math import factorial
from collections import Counter


def count(s):
    r = factorial(len(s))
    for v in Counter(s).values():
        r //= factorial(v)
    return r


def tests():
    out = ['aba', 'abc', 'z', 'aaaa', 'ba', 'cba', 'aaaaaaaaab', 'aaaaabbbbb', 'aabbccdd', 'abcdefg',
           'zyxwvaa', 'mississip', 'aaabbbccc', 'qwertyy', 'bbbbbbbbba']
    assert all(count(s) <= 6000 for s in out)
    return [s + '\n' for s in out]


def brute(inp):
    s = inp.strip()
    if len(s) > 8:
        # n! для длинных строк долго: вставляем буквы по одной во все позиции, дубли отсекает множество.
        res = {''}
        for ch in s:
            res = {w[:i] + ch + w[i:] for w in res for i in range(len(w) + 1)}
        return '\n'.join(sorted(res))
    return '\n'.join(sorted(set(''.join(p) for p in permutations(s))))
