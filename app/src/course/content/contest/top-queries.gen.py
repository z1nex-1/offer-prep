import random
import string


def rand_cmds(q, words, tops):
    cmds = []
    for _ in range(q):
        if random.random() < tops:
            cmds.append(f'TOP {random.randint(1, 10)}')
        else:
            cmds.append(f'ADD {random.choice(words)}')
    return f"{len(cmds)}\n" + '\n'.join(cmds) + '\n'


def tests():
    random.seed(98)
    out = ['7\nADD yandex\nADD maps\nADD yandex\nTOP 1\nADD maps\nTOP 2\nTOP 5\n', '2\nTOP 3\nADD a\n', '4\nADD b\nADD a\nADD c\nTOP 2\n']
    for q, words in ((20, ['a', 'b', 'c']), (100, ['x', 'y', 'z', 'w']), (400, [c for c in 'abcdefgh'])):
        out.append(rand_cmds(q, words, 0.15))
    words = [''.join(random.choice(string.ascii_lowercase) for _ in range(5)) for _ in range(2000)]
    out.append(rand_cmds(40000, words, 0.02))
    return out


def brute(inp):
    lines = inp.strip().split('\n')[1:]
    seen, out = [], []
    for line in lines:
        c, x = line.split()
        if c == 'ADD':
            seen.append(x)
        else:
            freq = {}
            for w in seen:
                freq[w] = freq.get(w, 0) + 1
            order = sorted(freq, key=lambda w: (-freq[w], w))
            out.append(' '.join(order[:int(x)]))
    return '\n'.join(out)
