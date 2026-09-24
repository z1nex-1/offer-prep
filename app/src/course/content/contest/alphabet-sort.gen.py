import random
import string
from functools import cmp_to_key

LETTERS = string.ascii_lowercase


def make(alphabet, words):
    return alphabet + '\n' + f'{len(words)}\n' + '\n'.join(words) + '\n'


def shuffled(seed_letters=LETTERS):
    s = list(seed_letters)
    random.shuffle(s)
    return ''.join(s)


def tests():
    random.seed(62)
    rev = LETTERS[::-1]
    out = [make('hlabcdefgijkmnopqrstuvwxyz', ['hello', 'leetcode', 'hell', 'apple', 'hl']),
           make(rev, ['ab', 'b', 'ba', 'a']), make(LETTERS, ['b', 'a', 'ab', 'a']), make(rev, ['z']),
           make(shuffled(), ['aaa', 'aa', 'a', 'aaaa'])]
    for n, k, ln in ((5, 3, 3), (8, 2, 4), (10, 26, 5), (15, 4, 6)):
        for _ in range(3):
            alphabet = shuffled()
            sub = LETTERS[:k]
            out.append(make(alphabet, [''.join(random.choice(sub) for _ in range(random.randint(1, ln))) for _ in range(n)]))
    n = 10000
    alphabet = shuffled()
    out.append(make(alphabet, [''.join(random.choice(LETTERS) for _ in range(random.randint(1, 20))) for _ in range(n)]))
    alphabet = shuffled()
    out.append(make(alphabet, [''.join(random.choice('abc') for _ in range(random.randint(15, 20))) for _ in range(n)]))
    return out


def brute(inp):
    data = inp.split()
    alphabet, words = data[0], data[2:]

    def cmp(x, y):
        for a, b in zip(x, y):
            if a != b:
                return -1 if alphabet.index(a) < alphabet.index(b) else 1
        return len(x) - len(y)

    return '\n'.join(sorted(words, key=cmp_to_key(cmp)))
