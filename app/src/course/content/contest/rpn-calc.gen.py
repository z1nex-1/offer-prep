import random


def rand_expr(n):
    parts, depth = [], 0
    for _ in range(n):
        if depth >= 2 and random.random() < 0.45:
            parts.append(random.choice('+-*'))
            depth -= 1
        else:
            parts.append(str(random.randint(0, 9)))
            depth += 1
    while depth > 1:
        parts.append(random.choice('+-'))
        depth -= 1
    return ' '.join(parts)


def tests():
    random.seed(82)
    out = ['8 9 + 1 7 - *\n', '5 3 -\n', '42\n', '2 3 + 4 *\n']
    for n in (5, 15, 60):
        out.append(rand_expr(n) + '\n')
    out.append(rand_expr(40000) + '\n')
    return out


def brute(inp):
    st = []
    for t in inp.split():
        if t in '+-*':
            b, a = st.pop(), st.pop()
            st.append(eval(f'({a}){t}({b})'))
        else:
            st.append(int(t))
    return st[0]
