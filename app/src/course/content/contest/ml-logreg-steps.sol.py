import sys
from math import exp, log


def sigmoid(z):
    if z >= 0:
        return 1 / (1 + exp(-z))
    e = exp(z)
    return e / (1 + e)


data = sys.stdin.read().split()
n, d, T = int(data[0]), int(data[1]), int(data[2])
lr, lam = float(data[3]), float(data[4])
X, y = [], []
pos = 5
for _ in range(n):
    X.append([1.0] + [float(v) for v in data[pos:pos + d]])
    y.append(int(data[pos + d]))
    pos += d + 1
m = d + 1
w = [0.0] * m
for _ in range(T):
    grad = [0.0] * m
    for xi, yi in zip(X, y):
        g = sigmoid(sum(a * b for a, b in zip(w, xi))) - yi
        for j in range(m):
            grad[j] += g * xi[j]
    w = [w[j] - lr * (grad[j] / n + (2 * lam * w[j] if j else 0.0)) for j in range(m)]
ll = 0.0
for xi, yi in zip(X, y):
    p = sigmoid(sum(a * b for a, b in zip(w, xi)))
    ll += log(p) if yi else log(1 - p)
print(' '.join(f"{round(v, 9) + 0.0:.9f}" for v in w))
print(f"{-ll / n:.9f}")
