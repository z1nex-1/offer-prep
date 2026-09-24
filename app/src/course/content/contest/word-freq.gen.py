import random


def tests():
    random.seed(13)
    out = ['the cat and the dog\nand the bird\n', 'one\n', 'b a\nc b a\n', 'Кот кот кот\nКот\n', 'x x x y y z\n', 'Z a z A\n',
           '  spaced   words  \n\nand   empty lines\n']
    pool = ['alpha', 'beta', 'gamma', 'delta', 'Alpha', 'b', 'bb', 'ab', 'ba', 'кот', 'пёс']
    for n in (30, 300):
        out.append('\n'.join(' '.join(random.choice(pool) for _ in range(random.randint(1, 8))) for _ in range(n // 4)) + '\n')
    words = [''.join(random.choice('abcde') for _ in range(random.randint(1, 4))) for _ in range(200000)]
    out.append('\n'.join(' '.join(words[i:i + 10]) for i in range(0, len(words), 10)) + '\n')
    return out


def brute(inp):
    words = inp.split()
    res = []
    for w in set(words):
        res.append((-words.count(w), w))
    res.sort()
    return '\n'.join(f'{w} {-c}' for c, w in res)
