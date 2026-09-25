import sys
from collections import deque


def main():
    data = sys.stdin.read().split()
    n, m = int(data[0]), int(data[1])
    grid = ''.join(data[2:2 + n])
    s, f = grid.index('S'), grid.index('F')
    dist = [-1] * (n * m)
    dist[s] = 0
    q = deque([s])
    while q:
        cur = q.popleft()
        if cur == f:
            break
        r, c = divmod(cur, m)
        d = dist[cur] + 1
        for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if 0 <= nr < n and 0 <= nc < m:
                nxt = nr * m + nc
                if dist[nxt] == -1 and grid[nxt] != '#':
                    dist[nxt] = d
                    q.append(nxt)
    print(dist[f])


main()
