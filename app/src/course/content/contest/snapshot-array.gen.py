import random


def rand_cmds(n, q):
    cmds, snaps = [], 0
    for _ in range(q):
        r = random.random()
        if r < 0.45:
            cmds.append(f'SET {random.randrange(n)} {random.randint(-50, 50)}')
        elif r < 0.65 or snaps == 0:
            cmds.append('SNAP')
            snaps += 1
        else:
            cmds.append(f'GET {random.randrange(n)} {random.randrange(snaps)}')
    return f"{n} {len(cmds)}\n" + '\n'.join(cmds) + '\n'


def tests():
    random.seed(96)
    out = ['3 7\nSET 0 5\nSNAP\nSET 0 6\nSET 0 7\nGET 0 0\nSNAP\nGET 0 1\n', '1 3\nSNAP\nGET 0 0\nSET 0 1\n', '2 4\nSNAP\nSNAP\nSET 1 9\nGET 1 1\n']
    for n, q in ((2, 20), (4, 100), (6, 400)):
        out.append(rand_cmds(n, q))
    out.append(rand_cmds(1000, 40000))
    return out


def brute(inp):
    lines = inp.strip().split('\n')
    n = int(lines[0].split()[0])
    arr = [0] * n
    shots, out = [], []
    for line in lines[1:]:
        p = line.split()
        if p[0] == 'SET':
            arr[int(p[1])] = int(p[2])
        elif p[0] == 'SNAP':
            out.append(str(len(shots)))
            shots.append(arr[:])
        else:
            out.append(str(shots[int(p[2])][int(p[1])]))
    return '\n'.join(out)
