import sys
from collections import deque


def main():
    data = sys.stdin.read().split()
    n, m = int(data[0]), int(data[1])
    grid = data[2:2 + n]
    dist = [[-1] * m for _ in range(n)]
    q = deque()
    for r in range(n):
        for c in range(m):
            if grid[r][c] == 'W':
                dist[r][c] = 0
                q.append((r, c))
    while q:
        r, c = q.popleft()
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < n and 0 <= nc < m and dist[nr][nc] == -1 and grid[nr][nc] != '#':
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))
    out = []
    for r in range(n):
        out.append(' '.join('#' if grid[r][c] == '#' else str(dist[r][c]) for c in range(m)))
    print('\n'.join(out))


main()
