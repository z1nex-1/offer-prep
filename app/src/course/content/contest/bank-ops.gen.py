import random


def rand_cmds(q, names, smax, income=0.1, pmax=100):
    cmds = []
    for _ in range(q):
        r = random.random()
        a, b = random.choice(names), random.choice(names)
        s = random.randint(1, smax)
        if r < 0.3:
            cmds.append(f'DEPOSIT {a} {s}')
        elif r < 0.5:
            cmds.append(f'WITHDRAW {a} {s}')
        elif r < 0.7:
            cmds.append(f'BALANCE {a}')
        elif r < 1 - income:
            cmds.append(f'TRANSFER {a} {b} {s}')
        else:
            cmds.append(f'INCOME {random.randint(0, pmax)}')
    return '\n'.join(cmds) + '\n'


def tests():
    random.seed(94)
    out = ['DEPOSIT ivan 100\nWITHDRAW ivan 30\nBALANCE ivan\nTRANSFER ivan petr 50\nBALANCE petr\nINCOME 10\nBALANCE ivan\nBALANCE petr\n',
           'BALANCE anna\nWITHDRAW anna 1\nTRANSFER anna bob 1\nBALANCE bob\n',
           'DEPOSIT a 10\nTRANSFER a a 10\nBALANCE a\nTRANSFER a a 11\nINCOME 99\nBALANCE a\n']
    for q in (20, 100, 400):
        out.append(rand_cmds(q, ['a', 'b', 'c', 'dd'], 50))
    out.append(rand_cmds(30000, [f'u{i}' for i in range(300)], 10 ** 6, income=0.002, pmax=5))
    return out


def brute(inp):
    accounts = []
    out = []
    def find(n):
        for acc in accounts:
            if acc[0] == n:
                return acc
        return None
    for line in inp.strip().split('\n'):
        p = line.split()
        if p[0] == 'DEPOSIT':
            a = find(p[1])
            if a is None:
                accounts.append([p[1], int(p[2])])
            else:
                a[1] += int(p[2])
        elif p[0] == 'WITHDRAW':
            a = find(p[1]); s = int(p[2])
            if a is not None and a[1] >= s:
                a[1] -= s; out.append('OK')
            else:
                out.append('ERROR')
        elif p[0] == 'BALANCE':
            a = find(p[1]); out.append(str(a[1]) if a else 'ERROR')
        elif p[0] == 'TRANSFER':
            a = find(p[1]); s = int(p[3])
            if a is not None and a[1] >= s:
                a[1] -= s
                b = find(p[2])
                if b is None:
                    accounts.append([p[2], s])
                else:
                    b[1] += s
                out.append('OK')
            else:
                out.append('ERROR')
        else:
            pct = int(p[1])
            for acc in accounts:
                if acc[1] > 0:
                    acc[1] += acc[1] * pct // 100
    return '\n'.join(out)
