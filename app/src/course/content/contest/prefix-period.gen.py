import random


def tests():
    random.seed(159)
    out = ['abcabca\n', 'aaaa\n', 'abcd\n', 'a\n', 'abab\n', 'aabaaab\n']
    for n in (10, 30, 100):
        base = ''.join(random.choice('ab') for _ in range(random.randint(1, 5)))
        s = (base * n)[:n]
        if random.random() < 0.5:
            s = s[:-1] + random.choice('ab')
        out.append(s + '\n')
    out.append(('abcab' * 40000)[:199999] + '\n')
    out.append('a' * 199999 + 'b\n')
    out.append(''.join(random.choice('ab') for _ in range(200000)) + '\n')
    return out


def brute(inp):
    s = inp.strip()
    n = len(s)
    if n > 2000:
        return None
    for k in range(1, n + 1):
        if all(s[i] == s[i + k] for i in range(n - k)):
            return k
