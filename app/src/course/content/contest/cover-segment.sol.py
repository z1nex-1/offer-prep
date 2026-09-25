import sys

data = sys.stdin.buffer.read().split()
L, n = int(data[0]), int(data[1])
segs = sorted(zip(map(int, data[2:2 * n + 2:2]), map(int, data[3:2 * n + 3:2])))
covered = count = i = 0
while covered < L:
    best = covered
    while i < n and segs[i][0] <= covered:
        if segs[i][1] > best:
            best = segs[i][1]
        i += 1
    if best == covered:
        count = -1
        break
    covered = best
    count += 1
print(count)
