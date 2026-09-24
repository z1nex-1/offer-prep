import random


def pack(qs):
    return f'{len(qs)}\n' + '\n'.join(qs) + '\n'


def rand_queries(q, names):
    qs = []
    for _ in range(q):
        r = random.random()
        name = random.choice(names)
        if r < 0.4:
            qs.append(f'ADD {name} +7{random.randint(10**9, 10**10 - 1)}')
        elif r < 0.6:
            qs.append(f'DEL {name}')
        elif r < 0.9:
            qs.append(f'FIND {name}')
        else:
            qs.append('COUNT')
    return qs


def tests():
    random.seed(17)
    out = [pack(['ADD anna 123', 'ADD boris 456', 'FIND anna', 'ADD anna 789', 'FIND anna', 'COUNT', 'DEL boris', 'FIND boris', 'DEL boris', 'COUNT']),
           pack(['COUNT']), pack(['FIND x']), pack(['DEL x', 'COUNT', 'ADD x 1', 'DEL x', 'FIND x']), pack(['ADD a 1', 'ADD A 2', 'FIND a', 'FIND A', 'COUNT'])]
    for q, k in ((30, 4), (300, 20)):
        out.append(pack(rand_queries(q, [f'u{i}' for i in range(k)])))
    out.append(pack(rand_queries(30000, [f'user{i}' for i in range(8000)])))
    return out


def brute(inp):
    lines = inp.split('\n')
    book = []
    out = []
    for line in lines[1:1 + int(lines[0])]:
        c = line.split()
        if c[0] == 'ADD':
            book = [p for p in book if p[0] != c[1]] + [(c[1], c[2])]
        elif c[0] == 'DEL':
            book = [p for p in book if p[0] != c[1]]
        elif c[0] == 'FIND':
            found = [p[1] for p in book if p[0] == c[1]]
            out.append(found[0] if found else 'NOT FOUND')
        else:
            out.append(str(len(book)))
    return '\n'.join(out)
