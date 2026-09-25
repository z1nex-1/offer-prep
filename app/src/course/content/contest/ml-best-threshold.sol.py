import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
rows = sorted(((int(data[2 + 2 * i]), data[1 + 2 * i] == b'1') for i in range(n)), reverse=True)
P = sum(1 for _, y in rows if y)
tp = fp = 0
best = 0.0
for k, (s, y) in enumerate(rows):
    if y:
        tp += 1
    else:
        fp += 1
    if k + 1 == n or rows[k + 1][0] != s:
        best = max(best, 2 * tp / (tp + fp + P))
print(f"{best:.9f}")
