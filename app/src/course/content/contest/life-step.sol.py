import sys

DIRS = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]

data = sys.stdin.read().split()
n, m, t = int(data[0]), int(data[1]), int(data[2])
grid = data[3:3 + n]
for _ in range(t):
    new = []
    for i in range(n):
        row = []
        for j in range(m):
            cnt = 0
            for di, dj in DIRS:
                ni, nj = i + di, j + dj
                if 0 <= ni < n and 0 <= nj < m and grid[ni][nj] == '#':
                    cnt += 1
            alive = grid[i][j] == '#'
            row.append('#' if cnt == 3 or (alive and cnt == 2) else '.')
        new.append(''.join(row))
    grid = new
print('\n'.join(grid))
