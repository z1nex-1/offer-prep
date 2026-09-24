import sys
from collections import deque

data = sys.stdin.read().split()
n = int(data[0])
window = deque()
res = []
for x in data[1:1 + n]:
    t = int(x)
    window.append(t)
    while window[0] < t - 3000:
        window.popleft()
    res.append(len(window))
print(' '.join(map(str, res)))
