import sys

data = sys.stdin.read().split()
n = int(data[0])
total = pref = 0
for x in map(int, data[1:1 + n]):
    total += x * pref
    pref += x
print(total)
