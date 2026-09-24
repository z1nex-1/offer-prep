import sys

data = sys.stdin.read().split()
n, m = int(data[0]), int(data[1])
a = [data[2 + i * m:2 + (i + 1) * m] for i in range(n)]
print('\n'.join(' '.join(row) for row in zip(*a[::-1])))
