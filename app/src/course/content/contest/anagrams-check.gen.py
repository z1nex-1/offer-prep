import random


def tests():
    random.seed(22)
    out = ['qiu\niuq\n', 'zprl\nzprc\n', 'aab\nabb\n', 'a\na\n', 'ab\nabc\n']
    for n in (5, 50):
        a = ''.join(random.choice('abc') for _ in range(n))
        b = list(a)
        random.shuffle(b)
        if random.random() < 0.5:
            b[0] = 'd'
        out.append(a + '\n' + ''.join(b) + '\n')
    a = ''.join(random.choice('abcdefghij') for _ in range(100000))
    b = list(a)
    random.shuffle(b)
    out.append(a + '\n' + ''.join(b) + '\n')
    return out


def brute(inp):
    a, b = inp.split('\n')[:2]
    return 1 if sorted(a) == sorted(b) else 0
