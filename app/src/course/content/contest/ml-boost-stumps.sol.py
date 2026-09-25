import sys

data = sys.stdin.read().split()
n, R, lr = int(data[0]), int(data[1]), float(data[2])
xs = [int(data[3 + 2 * i]) for i in range(n)]
ys = [int(data[4 + 2 * i]) for i in range(n)]
order = sorted(range(n), key=lambda i: xs[i])
base = sum(ys) / n
F = [base] * n
stumps = []
for _ in range(R):
    r = [ys[i] - F[i] for i in order]
    S = sum(r)
    SL = 0.0
    best = None
    for pos in range(n - 1):
        SL += r[pos]
        a, b = xs[order[pos]], xs[order[pos + 1]]
        if a == b:
            continue
        m = pos + 1
        gain = SL * SL / m + (S - SL) ** 2 / (n - m)
        if best is None or gain > best[0]:
            best = (gain, (a + b) / 2, SL / m, (S - SL) / (n - m))
    _, t, lv, rv = best
    stumps.append((t, lv, rv))
    for i in range(n):
        F[i] += lr * (lv if xs[i] <= t else rv)

mse = sum((ys[i] - F[i]) ** 2 for i in range(n)) / n
q = int(data[3 + 2 * n])
out = [f"{mse:.9f}"]
for j in range(q):
    x = int(data[4 + 2 * n + j])
    out.append(f"{base + lr * sum(lv if x <= t else rv for t, lv, rv in stumps):.9f}")
print('\n'.join(out))
