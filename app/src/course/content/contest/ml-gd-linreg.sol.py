import sys

data = sys.stdin.read().split()
n, d, T, lr = int(data[0]), int(data[1]), int(data[2]), float(data[3])
X, y = [], []
pos = 4
for _ in range(n):
    X.append([1.0] + [float(v) for v in data[pos:pos + d]])
    y.append(float(data[pos + d]))
    pos += d + 1
m = d + 1
w = [0.0] * m
for _ in range(T):
    grad = [0.0] * m
    for xi, yi in zip(X, y):
        e = sum(a * b for a, b in zip(w, xi)) - yi
        for j in range(m):
            grad[j] += e * xi[j]
    w = [w[j] - lr * 2 / n * grad[j] for j in range(m)]
mse = sum((sum(a * b for a, b in zip(w, xi)) - yi) ** 2 for xi, yi in zip(X, y)) / n
print(' '.join(f"{round(v, 9) + 0.0:.9f}" for v in w))
print(f"{mse:.9f}")
