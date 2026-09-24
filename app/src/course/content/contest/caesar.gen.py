import random
import string


def tests():
    random.seed(5)
    out = ['3\nHello, World!\n', '-1\nabc XYZ\n', '26\nZz\n', '0\nNothing changes 123.\n', '1000000000\nThe quick brown fox jumps over the lazy dog\n',
           '-1000000000\nThe quick brown fox jumps over the lazy dog\n', '25\nzZ!\n', '-27\na\n']
    chars = string.ascii_letters + string.digits + ' .,!?-'
    for n in (10, 100, 2000):
        s = 'x' + ''.join(random.choice(chars) for _ in range(n)) + 'y'
        out.append(f'{random.randint(-10**9, 10**9)}\n{s}\n')
    s = 'a' + ''.join(random.choice(chars) for _ in range(99998)) + 'b'
    out.append(f'{random.randint(-10**9, 10**9)}\n{s}\n')
    return out


def brute(inp):
    first, s = inp.split('\n')[:2]
    k = int(first)
    low = string.ascii_lowercase
    up = string.ascii_uppercase
    step = 1 if k >= 0 else -1
    k = abs(k) % 26
    res = []
    for ch in s:
        for alpha in (low, up):
            if ch in alpha:
                i = alpha.index(ch)
                for _ in range(k):
                    i = (i + step) % 26
                ch = alpha[i]
                break
        res.append(ch)
    return ''.join(res)
