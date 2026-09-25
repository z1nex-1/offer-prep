import random
import sys

data = sys.stdin.buffer.read().split()
n, d = int(data[0]), int(data[1])
X = [[int(v) for v in data[2 + i * d:2 + (i + 1) * d]] for i in range(n)]
mu = [sum(r[j] for r in X) / n for j in range(d)]
Xc = [[r[j] - mu[j] for j in range(d)] for r in X]
C = [[sum(r[a] * r[b] for r in Xc) / n for b in range(d)] for a in range(d)]
trace = sum(C[j][j] for j in range(d))
random.seed(1)
best = 0.0
for _ in range(3):
    v = [random.uniform(-1, 1) for _ in range(d)]
    for _ in range(500):
        w = [sum(C[i][j] * v[j] for j in range(d)) for i in range(d)]
        norm = sum(x * x for x in w) ** 0.5
        if norm == 0:
            break
        v = [x / norm for x in w]
    best = max(best, sum(v[i] * C[i][j] * v[j] for i in range(d) for j in range(d)))
print(f"{best / trace:.9f}")
