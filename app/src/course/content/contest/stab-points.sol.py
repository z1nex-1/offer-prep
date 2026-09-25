import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
segs = sorted(zip(map(int, data[1:2 * n + 1:2]), map(int, data[2:2 * n + 2:2])), key=lambda s: s[1])
last, count = -1, 0
for l, r in segs:
    if l > last:
        last = r
        count += 1
print(count)
