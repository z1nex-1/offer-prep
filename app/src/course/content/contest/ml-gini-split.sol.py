import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
rows = sorted((int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n))
K = 10
left = [0] * K
right = [0] * K
for _, y in rows:
    right[y] += 1
best = None
for i in range(n - 1):
    x, y = rows[i]
    left[y] += 1
    right[y] -= 1
    if rows[i + 1][0] == x:
        continue
    m = i + 1
    g = (m - sum(c * c for c in left) / m + (n - m) - sum(c * c for c in right) / (n - m)) / n
    if best is None or g < best[0]:
        best = (g, (x + rows[i + 1][0]) / 2)
print(f"{best[1]:.1f} {best[0]:.9f}")
