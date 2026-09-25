import sys

data = sys.stdin.read().split()
n = int(data[0])
y = [float(x) for x in data[1:1 + n]]
p = [float(x) for x in data[1 + n:1 + 2 * n]]
ss_res = sum((a - b) ** 2 for a, b in zip(y, p))
mae = sum(abs(a - b) for a, b in zip(y, p)) / n
if max(y) == min(y):
    r2 = 1.0 if ss_res == 0 else 0.0
else:
    mean = sum(y) / n
    r2 = 1 - ss_res / sum((a - mean) ** 2 for a in y)
print(f"{ss_res / n:.9f} {mae:.9f} {r2:.9f}")
