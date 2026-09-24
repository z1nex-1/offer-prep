import random
import string


def tests():
    random.seed(65)
    out = ['abcabcbb\n', 'bbbbb\n', 'pwwkew\n', 'a\n', 'abba\n', 'dvdf\n']
    for n in (10, 50, 300):
        out.append(''.join(random.choice('abcde') for _ in range(n)) + '\n')
    out.append(''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(100000)) + '\n')
    return out


def brute(inp):
    s = inp.strip()
    best = 0
    for i in range(len(s)):
        seen = set()
        for j in range(i, min(len(s), i + 40)):
            if s[j] in seen:
                break
            seen.add(s[j])
            best = max(best, j - i + 1)
    return best
