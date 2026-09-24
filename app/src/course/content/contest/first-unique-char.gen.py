import random


def tests():
    random.seed(24)
    out = ['leetcode\n', 'loveleetcode\n', 'aabb\n', 'z\n', 'aabbc\n']
    for n in (10, 40):
        out.append(''.join(random.choice('abcdefg') for _ in range(n)) + '\n')
    s = [random.choice('abcdefghijklmnopqrstuvwxy') for _ in range(100000)]
    out.append(''.join(s) + ''.join(s) + 'z\n' if False else ''.join(s) * 2 + 'z\n')
    return out


def brute(inp):
    s = inp.strip()
    for i, ch in enumerate(s):
        if s.count(ch) == 1:
            return i + 1
    return -1
