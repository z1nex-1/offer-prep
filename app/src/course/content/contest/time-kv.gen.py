import random


def rand_cmds(q, keys, tmax):
    last = {k: -1 for k in keys}
    cmds = []
    for _ in range(q):
        k = random.choice(keys)
        if random.random() < 0.5 and last[k] < tmax:
            t = random.randint(last[k] + 1, min(tmax, last[k] + 10))
            last[k] = t
            cmds.append(f'SET {k} v{random.randint(0, 99)} {t}')
        else:
            cmds.append(f'GET {k} {random.randint(0, tmax)}')
    return f"{len(cmds)}\n" + '\n'.join(cmds) + '\n'


def tests():
    random.seed(95)
    out = ['6\nSET a x 5\nGET a 4\nGET a 5\nSET a y 10\nGET a 7\nGET a 100\n', '2\nGET zz 1\nSET zz q 0\n', '3\nSET k v 0\nGET k 0\nGET m 0\n']
    for q in (20, 100, 400):
        out.append(rand_cmds(q, ['a', 'b', 'c'], 60))
    out.append(rand_cmds(40000, [f'k{i}' for i in range(50)], 10 ** 6))
    return out


def brute(inp):
    lines = inp.strip().split('\n')[1:]
    hist, out = [], []
    for line in lines:
        p = line.split()
        if p[0] == 'SET':
            hist.append((p[1], int(p[3]), p[2]))
        else:
            best = None
            for k, t, v in hist:
                if k == p[1] and t <= int(p[2]) and (best is None or t > best[0]):
                    best = (t, v)
            out.append(best[1] if best else 'NONE')
    return '\n'.join(out)
