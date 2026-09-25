import sys

data = sys.stdin.read().split()
n, d = int(data[0]), int(data[1])
rows = []
ys = []
pos = 2
for _ in range(n):
    rows.append([1.0] + [float(v) for v in data[pos:pos + d]])
    ys.append(float(data[pos + d]))
    pos += d + 1
m = d + 1
A = [[sum(r[i] * r[j] for r in rows) for j in range(m)] + [sum(r[i] * y for r, y in zip(rows, ys))] for i in range(m)]
for col in range(m):
    piv = max(range(col, m), key=lambda r: abs(A[r][col]))
    A[col], A[piv] = A[piv], A[col]
    for r in range(m):
        if r != col and A[r][col] != 0:
            f = A[r][col] / A[col][col]
            for c in range(col, m + 1):
                A[r][c] -= f * A[col][c]
print(' '.join(f"{round(A[i][m] / A[i][i], 9) + 0.0:.9f}" for i in range(m)))
