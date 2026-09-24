import sys

data = sys.stdin.read().split()
n = int(data[0])
a = data[1:1 + n]
w = 0
for x in a:
    if w < 2 or x != a[w - 2]:
        a[w] = x
        w += 1
print(w)
print(' '.join(a[:w]))
