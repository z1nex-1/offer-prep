import random


def rand_valid(n):
    s, st = [], []
    for _ in range(n):
        if st and random.random() < 0.5:
            s.append({'(': ')', '[': ']', '{': '}'}[st.pop()])
        else:
            c = random.choice('([{')
            st.append(c)
            s.append(c)
    while st:
        s.append({'(': ')', '[': ']', '{': '}'}[st.pop()])
    return ''.join(s)


def tests():
    random.seed(81)
    out = ['()[]{}\n', '([)]\n', '\n', '((\n', '))((\n', '{[()()]}\n', ']\n']
    for n in (5, 20, 100):
        s = rand_valid(n)
        out.append(s + '\n')
        t = list(s)
        t[random.randrange(len(t))] = random.choice('()[]{}')
        out.append(''.join(t) + '\n')
    out.append(rand_valid(40000) + '\n')
    out.append(rand_valid(40000) + ')\n')
    return out


def brute(inp):
    s = inp.strip()
    prev = None
    while prev != s:
        prev = s
        s = s.replace('()', '').replace('[]', '').replace('{}', '')
    return 'yes' if not s else 'no'
