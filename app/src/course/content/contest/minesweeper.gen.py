import random


def field(n, m, p):
    rows = [''.join('*' if random.random() < p else '.' for _ in range(m)) for _ in range(n)]
    return f'{n} {m}\n' + '\n'.join(rows) + '\n'


def tests():
    random.seed(8)
    out = ['3 4\n*...\n..*.\n....\n', '2 2\n**\n*.\n', '1 1\n.\n', '1 1\n*\n', '1 5\n.*.*.\n', '5 1\n*\n.\n.\n*\n.\n',
           '3 3\n***\n*.*\n***\n', '3 3\n...\n...\n...\n', '2 3\n..*\n*..\n']
    for n, m, p in ((5, 5, 0.3), (10, 20, 0.2), (50, 50, 0.1), (300, 300, 0.15), (300, 300, 0.6)):
        out.append(field(n, m, p))
    return out


def brute(inp):
    data = inp.split()
    n, m = int(data[0]), int(data[1])
    grid = data[2:2 + n]
    cnt = [[0] * m for _ in range(n)]
    for i in range(n):
        for j in range(m):
            if grid[i][j] == '*':
                for a in range(max(0, i - 1), min(n, i + 2)):
                    for b in range(max(0, j - 1), min(m, j + 2)):
                        cnt[a][b] += 1
    return '\n'.join(''.join('*' if grid[i][j] == '*' else str(cnt[i][j]) for j in range(m)) for i in range(n))
