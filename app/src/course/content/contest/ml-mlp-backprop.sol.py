import sys
from math import exp


def sig(t):
    if t >= 0:
        return 1 / (1 + exp(-t))
    e = exp(t)
    return e / (1 + e)


data = sys.stdin.read().split()
n, d, h, T = int(data[0]), int(data[1]), int(data[2]), int(data[3])
lr = float(data[4])
vals = list(map(float, data[5:]))
pos = 0
X, Y = [], []
for _ in range(n):
    X.append(vals[pos:pos + d])
    Y.append(vals[pos + d])
    pos += d + 1
W1 = [vals[pos + j * d:pos + (j + 1) * d] for j in range(h)]
pos += h * d
b1 = vals[pos:pos + h]
pos += h
w2 = vals[pos:pos + h]
b2 = vals[pos + h]


def forward(x):
    a = [sig(sum(W1[j][k] * x[k] for k in range(d)) + b1[j]) for j in range(h)]
    return a, sum(w2[j] * a[j] for j in range(h)) + b2


for _ in range(T):
    gW1 = [[0.0] * d for _ in range(h)]
    gb1 = [0.0] * h
    gw2 = [0.0] * h
    gb2 = 0.0
    for x, y in zip(X, Y):
        a, yh = forward(x)
        g = 2 * (yh - y) / n
        gb2 += g
        for j in range(h):
            gw2[j] += g * a[j]
            dz = g * w2[j] * a[j] * (1 - a[j])
            gb1[j] += dz
            for k in range(d):
                gW1[j][k] += dz * x[k]
    W1 = [[W1[j][k] - lr * gW1[j][k] for k in range(d)] for j in range(h)]
    b1 = [b1[j] - lr * gb1[j] for j in range(h)]
    w2 = [w2[j] - lr * gw2[j] for j in range(h)]
    b2 -= lr * gb2

loss = sum((forward(x)[1] - y) ** 2 for x, y in zip(X, Y)) / n
f = lambda v: f"{round(v, 9) + 0.0:.9f}"
out = [' '.join(map(f, row)) for row in W1]
out += [' '.join(map(f, b1)), ' '.join(map(f, w2)), f(b2), f(loss)]
print('\n'.join(out))
