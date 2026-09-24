import random
import string


def tests():
    random.seed(21)
    out = ['ab\naabbccd\n', 'z\nZZz\n', 'abc\ndef\n', 'aA\naAAbbbb\n']
    for n in (10, 100):
        j = ''.join(random.sample(string.ascii_letters, 5))
        s = ''.join(random.choice(string.ascii_letters[:12] + 'ABC') for _ in range(n))
        out.append(f'{j}\n{s}\n')
    out.append(''.join(random.sample(string.ascii_letters, 20)) + '\n' + ''.join(random.choice(string.ascii_letters) for _ in range(100000)) + '\n')
    return out


def brute(inp):
    j, s = inp.split('\n')[:2]
    return sum(1 for ch in s if ch in j)
