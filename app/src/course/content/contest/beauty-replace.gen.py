import random


def tests():
    random.seed(68)
    out = ['2\nabaa\n', '0\nabc\n', '1\naabccbb\n', '10\nab\n', '0\nzzzz\n']
    for n in (8, 40, 150):
        out.append(f"{random.randint(0, 5)}\n" + ''.join(random.choice('abc') for _ in range(n)) + '\n')
    out.append('500\n' + ''.join(random.choice('abcdefgh') for _ in range(40000)) + '\n')
    return out


def brute(inp):
    k, s = inp.split()
    k = int(k)
    best = 0
    for i in range(len(s)):
        for j in range(i, len(s)):
            seg = s[i:j + 1]
            mx = max(seg.count(c) for c in set(seg))
            if len(seg) - mx <= k:
                best = max(best, len(seg))
    return best
