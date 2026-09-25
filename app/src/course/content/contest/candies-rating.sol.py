import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
r = list(map(int, data[1:n + 1]))
c = [1] * n
for i in range(1, n):
    if r[i] > r[i - 1]:
        c[i] = c[i - 1] + 1
for i in range(n - 2, -1, -1):
    if r[i] > r[i + 1] and c[i] <= c[i + 1]:
        c[i] = c[i + 1] + 1
print(sum(c))
