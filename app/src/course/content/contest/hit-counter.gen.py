import random


def rand_cmds(q, step):
    t, cmds = 0, []
    for _ in range(q):
        t += random.randint(0, step)
        cmds.append(('HIT' if random.random() < 0.6 else 'COUNT') + f' {t}')
    return cmds


def fmt(cmds):
    return f"{len(cmds)}\n" + '\n'.join(cmds) + '\n'


def tests():
    random.seed(92)
    out = [fmt(['HIT 1', 'HIT 2', 'HIT 3', 'COUNT 4', 'HIT 300', 'COUNT 300', 'COUNT 301', 'COUNT 302']),
           fmt(['COUNT 5']), fmt(['HIT 0', 'COUNT 299', 'COUNT 300'])]
    for q, step in ((20, 60), (100, 30), (500, 10)):
        out.append(fmt(rand_cmds(q, step)))
    out.append(fmt(rand_cmds(40000, 3)))
    return out


def brute(inp):
    lines = inp.strip().split('\n')[1:]
    hits, out = [], []
    for line in lines:
        c, t = line.split()
        t = int(t)
        if c == 'HIT':
            hits.append(t)
        else:
            out.append(str(sum(1 for h in hits if t - 300 < h <= t)))
    return '\n'.join(out)
