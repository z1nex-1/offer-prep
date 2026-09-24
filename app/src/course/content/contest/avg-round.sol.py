import sys

data = sys.stdin.read().split()
n = int(data[0])
s = sum(map(int, data[1:1 + n]))
x = (200 * s + n) // (2 * n)
print(f"{x // 100}.{x % 100:02d}")
