import random


def encode(root):
    # root: (val, left, right) или None; запись по уровням без хвостовых null
    out, q = [], [root]
    for node in q:
        if node is None:
            out.append('null')
        else:
            out.append(str(node[0]))
            q.append(node[1])
            q.append(node[2])
    while out and out[-1] == 'null':
        out.pop()
    return ' '.join(out) + '\n'


def rand_tree(n, p_left=0.5, chain=False):
    nodes = [[random.randint(-10**9, 10**9), None, None]]
    for _ in range(n - 1):
        while True:
            par = nodes[-1] if chain else random.choice(nodes)
            side = 1 if random.random() < p_left else 2
            if par[side] is None:
                break
            if chain:
                side = 3 - side
                if par[side] is None:
                    break
        child = [random.randint(-10**9, 10**9), None, None]
        par[side] = child
        nodes.append(child)
    return nodes[0]


def tests():
    random.seed(33)
    out = ['1 2 3 null 5 null 4\n', '1 2 3 4\n', '7\n', '1 null 2 null 3 null 4\n', '1 2 null 3 null 4\n',
           '5 3 8 1 4 7 9 null 2 null null null null null 10\n']
    for n in (10, 100, 3000):
        out.append(encode(rand_tree(n)))
    out.append(encode(rand_tree(20000)))
    out.append(encode(rand_tree(3000, p_left=0.9, chain=True)))
    out.append(encode(rand_tree(3000, p_left=0.1, chain=True)))
    return out


def brute(inp):
    vals = inp.split()
    # восстановление с объектами и рекурсивный DFS «сначала вправо»
    nodes = [[vals[0], None, None, 0]]
    q, pos = [nodes[0]], 1
    for node in q:
        for side in (1, 2):
            if pos < len(vals):
                if vals[pos] != 'null':
                    child = [vals[pos], None, None, node[3] + 1]
                    node[side] = child
                    q.append(child)
                pos += 1
    res = []
    stack = [nodes[0]]
    while stack:
        node = stack.pop()
        if node[3] == len(res):
            res.append(node[0])
        for side in (1, 2):
            if node[side]:
                stack.append(node[side])
    return ' '.join(res)
