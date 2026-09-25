import sys

data = sys.stdin.read().split()
n = int(data[0])
y = data[1:1 + n]
p = data[1 + n:1 + 2 * n]
tp = fp = fn = 0
for a, b in zip(y, p):
    if b == '1':
        if a == '1':
            tp += 1
        else:
            fp += 1
    elif a == '1':
        fn += 1
prec = tp / (tp + fp) if tp + fp else 0.0
rec = tp / (tp + fn) if tp + fn else 0.0
f1 = 2 * tp / (2 * tp + fp + fn) if tp else 0.0
print(f"{prec:.9f} {rec:.9f} {f1:.9f}")
