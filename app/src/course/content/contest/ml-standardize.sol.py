import sys

data = sys.stdin.buffer.read().split()
n, m, d = int(data[0]), int(data[1]), int(data[2])
vals = list(map(int, data[3:]))
train = [vals[i * d:(i + 1) * d] for i in range(n)]
test = [vals[(n + i) * d:(n + i + 1) * d] for i in range(m)]
mu = [sum(r[j] for r in train) / n for j in range(d)]
sd = [(sum((r[j] - mu[j]) ** 2 for r in train) / n) ** 0.5 for j in range(d)]
out = []
for r in test:
    out.append(' '.join(f"{round((r[j] - mu[j]) / sd[j], 9) + 0.0:.9f}" if sd[j] > 0 else '0' for j in range(d)))
print('\n'.join(out))
