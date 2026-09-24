import sys

data = sys.stdin.read().split()
n = int(data[0])
a = sorted(map(int, data[1:1 + n]))
total = pref = 0
for j, x in enumerate(a):
    total += j * x - pref
    pref += x
print(total)
