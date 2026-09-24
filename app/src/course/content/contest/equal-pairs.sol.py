import sys
from collections import Counter

data = sys.stdin.read().split()
n = int(data[0])
cnt = Counter(data[1:1 + n])
print(sum(k * (k - 1) // 2 for k in cnt.values()))
