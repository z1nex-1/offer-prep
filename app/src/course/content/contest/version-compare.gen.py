import random


def ver(k, top):
    return '.'.join(str(random.randint(0, top)).zfill(random.choice([1, 1, 1, 2])) for _ in range(k))


def fmt(pairs):
    return f"{len(pairs)}\n" + '\n'.join(f'{a} {b}' for a, b in pairs) + '\n'


def tests():
    random.seed(152)
    out = [fmt([('1.2.10', '1.2.9'), ('1.0', '1'), ('1.01', '1.001'), ('0.1', '1.1')]),
           fmt([('1.0.0.0', '1'), ('2', '10'), ('1.10', '1.9'), ('3.0.1', '3')])]
    pairs = []
    for _ in range(200):
        a = ver(random.randint(1, 4), 3)
        b = a if random.random() < 0.2 else ver(random.randint(1, 4), 3)
        if random.random() < 0.2:
            b = a + '.0' * random.randint(1, 2)
        pairs.append((a, b))
    out.append(fmt(pairs))
    pairs = [(ver(random.randint(1, 20), 10 ** 9 - 1), ver(random.randint(1, 20), 10 ** 9 - 1)) for _ in range(2500)]
    out.append(fmt(pairs))
    return out


def brute(inp):
    lines = inp.split('\n')
    q = int(lines[0])
    res = []
    for i in range(1, q + 1):
        a, b = lines[i].split()
        x = list(map(int, a.split('.')))
        y = list(map(int, b.split('.')))
        m = max(len(x), len(y))
        x += [0] * (m - len(x))
        y += [0] * (m - len(y))
        c = 0
        for p, r in zip(x, y):
            if p != r:
                c = -1 if p < r else 1
                break
        res.append('<' if c < 0 else '>' if c > 0 else '=')
    return '\n'.join(res)
