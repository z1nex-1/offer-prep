import random

PIECES = ['king', 'queen', 'rook', 'bishop', 'knight']
CELLS = [c + r for c in 'abcdefgh' for r in '12345678']


def pack(qs):
    return f'{len(qs)}\n' + '\n'.join(' '.join(q) for q in qs) + '\n'


def tests():
    random.seed(7)
    out = [pack([('knight', 'g1', 'f3')]), pack([('bishop', 'c1', 'c3')]),
           pack([('king', 'e1', 'f2'), ('queen', 'd1', 'h5'), ('rook', 'a1', 'a8'), ('rook', 'a1', 'b2'), ('knight', 'b1', 'd2')])]
    out.append(pack([(p, a, b) for p in PIECES for a in ('a1', 'd4', 'h8') for b in CELLS if b != a]))
    for q in (20, 300, 10000):
        qs = []
        for _ in range(q):
            a, b = random.sample(CELLS, 2)
            qs.append((random.choice(PIECES), a, b))
        out.append(pack(qs))
    return out


def moves(piece, a):
    x, y = ord(a[0]) - 97, int(a[1]) - 1
    lines = {'rook': [(1, 0), (-1, 0), (0, 1), (0, -1)], 'bishop': [(1, 1), (1, -1), (-1, 1), (-1, -1)]}
    lines['queen'] = lines['rook'] + lines['bishop']
    res = set()
    if piece in lines:
        for dx, dy in lines[piece]:
            nx, ny = x + dx, y + dy
            while 0 <= nx < 8 and 0 <= ny < 8:
                res.add((nx, ny))
                nx, ny = nx + dx, ny + dy
    else:
        steps = [(dx, dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1) if dx or dy] if piece == 'king' else \
            [(1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1)]
        for dx, dy in steps:
            if 0 <= x + dx < 8 and 0 <= y + dy < 8:
                res.add((x + dx, y + dy))
    return res


def brute(inp):
    data = inp.split()
    res = []
    for i in range(int(data[0])):
        p, a, b = data[1 + 3 * i:4 + 3 * i]
        res.append('YES' if (ord(b[0]) - 97, int(b[1]) - 1) in moves(p, a) else 'NO')
    return '\n'.join(res)
