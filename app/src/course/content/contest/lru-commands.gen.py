import random


def rand_cmds(q, keys, vmax):
    cmds = []
    for _ in range(q):
        k = random.randint(1, keys)
        if random.random() < 0.5:
            cmds.append(f'PUT {k} {random.randint(-vmax, vmax)}')
        else:
            cmds.append(f'GET {k}')
    return cmds


def fmt(c, cmds):
    return f"{c} {len(cmds)}\n" + '\n'.join(cmds) + '\n'


def tests():
    random.seed(91)
    out = [fmt(2, ['PUT 1 1', 'PUT 2 2', 'GET 1', 'PUT 3 3', 'GET 2', 'PUT 4 4', 'GET 1', 'GET 3', 'GET 4']),
           fmt(1, ['PUT 5 7', 'PUT 5 8', 'GET 5', 'PUT 6 1', 'GET 5', 'GET 6']),
           fmt(3, ['GET 1'])]
    for c, q, keys in ((1, 20, 3), (2, 50, 5), (4, 200, 8)):
        out.append(fmt(c, rand_cmds(q, keys, 9)))
    out.append(fmt(1000, rand_cmds(30000, 3000, 10 ** 9)))
    return out


def brute(inp):
    lines = inp.strip().split('\n')
    c = int(lines[0].split()[0])
    order = []
    val = {}
    out = []
    for line in lines[1:]:
        p = line.split()
        k = int(p[1])
        if p[0] == 'GET':
            if k in val:
                order.remove(k); order.append(k)
                out.append(str(val[k]))
            else:
                out.append('-1')
        else:
            if k in val:
                order.remove(k)
            order.append(k)
            val[k] = int(p[2])
            if len(order) > c:
                del val[order.pop(0)]
    return '\n'.join(out)
