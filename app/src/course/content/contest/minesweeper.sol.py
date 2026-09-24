import sys

DIRS = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
grid = data[2:2 + n]
res = []
for i in range(n):
    row = []
    for j in range(m):
        if grid[i][j] == '*':
            row.append('*')
            continue
        cnt = 0
        for di, dj in DIRS:
            ni, nj = i + di, j + dj
            if 0 <= ni < n and 0 <= nj < m and grid[ni][nj] == '*':
                cnt += 1
        row.append(str(cnt))
    res.append(''.join(row))
print('\n'.join(res))
