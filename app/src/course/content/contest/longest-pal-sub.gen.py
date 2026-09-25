import random


def tests():
    random.seed(154)
    out = ['babad\n', 'cbbd\n', 'a\n', 'abcde\n', 'forgeeksskeegfor\n', 'abacdfgdcaba\n']
    for n in (10, 25, 50):
        out.append(''.join(random.choice('ab') for _ in range(n)) + '\n')
    out.append('a' * 2000 + '\n')
    half = ''.join(random.choice('abc') for _ in range(700))
    out.append(''.join(random.choice('abc') for _ in range(300)) + half + half[::-1] + '\n')
    return out


def brute(inp):
    s = inp.strip()
    n = len(s)
    if n > 60:
        return None
    for length in range(n, 0, -1):
        for i in range(n - length + 1):
            t = s[i:i + length]
            if t == t[::-1]:
                return f'{length}\n{t}'
