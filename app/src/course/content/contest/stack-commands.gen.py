import random


def rand_cmds(n):
    cmds = []
    for _ in range(n):
        r = random.random()
        if r < 0.4:
            cmds.append(f'push {random.randint(-100, 100)}')
        elif r < 0.6:
            cmds.append('pop')
        elif r < 0.75:
            cmds.append('back')
        elif r < 0.9:
            cmds.append('size')
        else:
            cmds.append('clear')
    return '\n'.join(cmds + ['exit']) + '\n'


def tests():
    random.seed(83)
    out = ['push 1\nback\nexit\n', 'pop\nback\nsize\nexit\n', 'push 3\npush 14\nsize\nclear\npush 1\nback\npush 2\nback\npop\nsize\npop\nsize\nexit\n', 'exit\npush 5\n']
    for n in (10, 50, 300):
        out.append(rand_cmds(n))
    out.append(rand_cmds(40000))
    return out


def brute(inp):
    st, out = [], []
    for line in inp.splitlines():
        p = line.split()
        if not p:
            continue
        if p[0] == 'exit':
            out.append('bye')
            break
        if p[0] == 'push':
            st.insert(0, p[1]); out.append('ok')
        elif p[0] == 'pop':
            out.append(st.pop(0) if st else 'error')
        elif p[0] == 'back':
            out.append(st[0] if st else 'error')
        elif p[0] == 'size':
            out.append(str(len(st)))
        elif p[0] == 'clear':
            st = []; out.append('ok')
    return '\n'.join(out)
