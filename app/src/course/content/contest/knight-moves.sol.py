from collections import deque

n = int(input())
x1, y1, x2, y2 = map(int, input().split())
dist = [[-1] * (n + 1) for _ in range(n + 1)]
dist[x1][y1] = 0
q = deque([(x1, y1)])
moves = ((1, 2), (2, 1), (-1, 2), (-2, 1), (1, -2), (2, -1), (-1, -2), (-2, -1))
while q:
    x, y = q.popleft()
    if (x, y) == (x2, y2):
        break
    for dx, dy in moves:
        nx, ny = x + dx, y + dy
        if 1 <= nx <= n and 1 <= ny <= n and dist[nx][ny] == -1:
            dist[nx][ny] = dist[x][y] + 1
            q.append((nx, ny))
print(dist[x2][y2])
