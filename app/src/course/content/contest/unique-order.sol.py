import sys

data = sys.stdin.read().split()
n = int(data[0])
seen = set()
res = []
for x in data[1:1 + n]:
    v = int(x)
    if v not in seen:
        seen.add(v)
        res.append(x)
print(' '.join(res))
