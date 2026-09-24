import sys

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
a = [list(map(int, data[2 + i * m:2 + (i + 1) * m])) for i in range(n)]
row_min = [min(row) for row in a]
col_max = [max(c) for c in zip(*a)]
print(sum(1 for i in range(n) for j in range(m) if a[i][j] == row_min[i] == col_max[j]))
