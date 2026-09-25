import random


def tests():
    random.seed(155)
    out = ['aabcbcdbca\n', 'aaaa\n', 'abc\n', 'z\n', 'abcabcbb\n']
    for n in (10, 40, 200):
        out.append(''.join(random.choice('abcd') for _ in range(n)) + '\n')
    s = ''.join(random.choice('abcdefghijklmnopqrstuvwxy') for _ in range(150000)) + 'z'
    out.append(s + '\n')
    out.append(''.join(random.choice('abcdefghij') for _ in range(150000)) + '\n')
    return out


def brute(inp):
    s = inp.strip()
    n = len(s)
    if n > 300:
        return None
    k = len(set(s))
    best = n
    for i in range(n):
        seen = set()
        for j in range(i, n):
            seen.add(s[j])
            if len(seen) == k:
                best = min(best, j - i + 1)
                break
    return best
