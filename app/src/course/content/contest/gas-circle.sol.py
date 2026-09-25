import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
g = list(map(int, data[1:n + 1]))
c = list(map(int, data[n + 1:2 * n + 1]))
if sum(g) < sum(c):
    print(-1)
else:
    start = tank = 0
    for i in range(n):
        tank += g[i] - c[i]
        if tank < 0:
            start, tank = i + 1, 0
    print(start + 1)
