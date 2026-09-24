import sys


def can(piece, a, b):
    dx = abs(ord(a[0]) - ord(b[0]))
    dy = abs(int(a[1]) - int(b[1]))
    rook = dx == 0 or dy == 0
    bishop = dx == dy
    if piece == 'king':
        return max(dx, dy) == 1
    if piece == 'rook':
        return rook
    if piece == 'bishop':
        return bishop
    if piece == 'queen':
        return rook or bishop
    return {dx, dy} == {1, 2}


data = sys.stdin.read().split()
q = int(data[0])
res = []
for i in range(q):
    piece, a, b = data[1 + 3 * i:4 + 3 * i]
    res.append('YES' if can(piece, a, b) else 'NO')
print('\n'.join(res))
