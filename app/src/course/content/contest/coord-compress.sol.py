import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
rank = {v: i + 1 for i, v in enumerate(sorted(set(a)))}
print(' '.join(str(rank[x]) for x in a))
