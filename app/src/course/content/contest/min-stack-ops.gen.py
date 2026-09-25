import random


def rand_ops(q, vmax):
    ops, size = [], 0
    while len(ops) < q:
        r = random.random()
        if size == 0 or r < 0.45:
            ops.append(f'1 {random.randint(-vmax, vmax)}')
            size += 1
        elif r < 0.7:
            ops.append('2')
            size -= 1
        else:
            ops.append('3')
    return f'{len(ops)}\n' + '\n'.join(ops) + '\n'


def tests():
    random.seed(84)
    out = ['8\n1 1\n1 2\n1 3\n3\n2\n1 -1\n3\n2\n', '3\n1 5\n3\n2\n', '5\n1 3\n1 3\n2\n3\n1 7\n']
    for q in (10, 60, 300):
        out.append(rand_ops(q, 20))
    out.append(rand_ops(40000, 10 ** 9))
    return out


def brute(inp):
    d = inp.split()
    q = int(d[0])
    pos, st, out = 1, [], []
    for _ in range(q):
        t = d[pos]; pos += 1
        if t == '1':
            st.append(int(d[pos])); pos += 1
        elif t == '2':
            st.pop()
        else:
            out.append(min(st))
    return '\n'.join(map(str, out))
