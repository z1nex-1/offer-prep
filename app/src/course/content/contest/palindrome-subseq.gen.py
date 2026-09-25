import random


def tests():
    random.seed(127)
    out = ['bbbab\n', 'cbbd\n', 'a\n', 'abcde\n', 'racecar\n']
    for n in (6, 10, 14):
        out.append(''.join(random.choice('ab') for _ in range(n)) + '\n')
    out.append(''.join(random.choice('abcd') for _ in range(1000)) + '\n')
    return out


def brute(inp):
    s = inp.strip()
    n = len(s)
    if n > 14:
        return None
    best = 0
    for mask in range(1, 1 << n):
        t = ''.join(s[i] for i in range(n) if mask >> i & 1)
        if t == t[::-1]:
            best = max(best, len(t))
    return best
