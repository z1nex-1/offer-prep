import random


def rand_cmds(q, keys, vals):
    cmds = []
    for _ in range(q):
        r = random.random()
        if r < 0.3:
            cmds.append(f'SET {random.choice(keys)} {random.choice(vals)}')
        elif r < 0.45:
            cmds.append(f'GET {random.choice(keys)}')
        elif r < 0.55:
            cmds.append(f'UNSET {random.choice(keys)}')
        elif r < 0.65:
            cmds.append(f'COUNT {random.choice(vals)}')
        elif r < 0.8:
            cmds.append('BEGIN')
        elif r < 0.93:
            cmds.append('ROLLBACK')
        else:
            cmds.append('COMMIT')
    return '\n'.join(cmds) + '\n'


def tests():
    random.seed(97)
    out = ['SET a 10\nBEGIN\nSET a 20\nGET a\nROLLBACK\nGET a\nROLLBACK\n',
           'BEGIN\nSET a 30\nBEGIN\nSET a 40\nCOMMIT\nGET a\nROLLBACK\nCOUNT 40\n',
           'SET a 10\nSET b 10\nCOUNT 10\nBEGIN\nUNSET a\nCOUNT 10\nROLLBACK\nCOUNT 10\nGET a\n',
           'COMMIT\nUNSET zz\nGET zz\n']
    for q in (20, 80, 300):
        out.append(rand_cmds(q, ['a', 'b', 'c'], ['1', '2']))
    out.append(rand_cmds(40000, [f'k{i}' for i in range(200)], [str(i) for i in range(20)]))
    return out


def brute(inp):
    stack = [{}]
    out = []
    for line in inp.strip().split('\n'):
        p = line.split()
        cur = stack[-1]
        if p[0] == 'SET':
            cur[p[1]] = p[2]
        elif p[0] == 'UNSET':
            cur.pop(p[1], None)
        elif p[0] == 'GET':
            out.append(cur.get(p[1], 'NULL'))
        elif p[0] == 'COUNT':
            out.append(str(sum(1 for v in cur.values() if v == p[1])))
        elif p[0] == 'BEGIN':
            stack.append(dict(cur))
        elif p[0] == 'ROLLBACK':
            if len(stack) == 1:
                out.append('NO TRANSACTION')
            else:
                stack.pop()
        else:
            if len(stack) == 1:
                out.append('NO TRANSACTION')
            else:
                stack = [cur]
    return '\n'.join(out)
