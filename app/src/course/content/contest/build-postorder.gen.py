import random


def rand_tree(n, maxh):
    # вершины 0..n-1; случайное дерево с ограничением высоты
    L, R, depth = [-1] * n, [-1] * n, [0] * n
    for v in range(1, n):
        while True:
            p = random.randrange(v)
            if depth[p] + 1 > maxh:
                continue
            side = random.choice((L, R))
            if side[p] == -1:
                side[p] = v
                depth[v] = depth[p] + 1
                break
    return L, R


def chain(n, zigzag):
    L, R = [-1] * n, [-1] * n
    for v in range(n - 1):
        side = (L if v % 2 else R) if zigzag else L
        side[v] = v + 1
    return L, R


def orders(L, R, labels):
    pre, ino, post = [], [], []
    st = [(0, 0)]
    while st:
        v, state = st.pop()
        if v == -1:
            continue
        if state == 0:
            pre.append(labels[v])
            st.append((v, 1)); st.append((L[v], 0))
        elif state == 1:
            ino.append(labels[v])
            st.append((v, 2)); st.append((R[v], 0))
        else:
            post.append(labels[v])
    return pre, ino, post


ANSWERS = {}


def make(L, R):
    n = len(L)
    labels = list(range(1, n + 1))
    random.shuffle(labels)
    pre, ino, post = orders(L, R, labels)
    s = f'{n}\n{" ".join(map(str, pre))}\n{" ".join(map(str, ino))}\n'
    ANSWERS[s] = ' '.join(map(str, post))
    return s


def tests():
    random.seed(77)
    out = ['5\n3 1 2 4 5\n1 3 4 2 5\n', '3\n1 2 3\n3 2 1\n']
    out.append(make([-1], [-1]))
    for n, h in ((6, 10), (15, 10), (100, 20), (1000, 30)):
        out.append(make(*rand_tree(n, h)))
    out.append(make(*chain(500, False)))
    out.append(make(*chain(500, True)))
    out.append(make(*rand_tree(10000, 60)))
    out.append(make(*rand_tree(10000, 500)))
    return out


def brute(inp):
    if inp in ANSWERS:
        return ANSWERS[inp]
    # примеры из условия: восстанавливаем срезами, независимо от эталона
    d = inp.split()
    n = int(d[0])
    pre, ino = d[1:n + 1], d[n + 1:]

    def post(pre, ino):
        if not pre:
            return []
        k = ino.index(pre[0])
        return post(pre[1:k + 1], ino[:k]) + post(pre[k + 1:], ino[k + 1:]) + [pre[0]]
    return ' '.join(post(pre, ino))
