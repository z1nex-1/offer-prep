import sys

data = sys.stdin.buffer.read().split()
n = int(data[0])
pairs = sorted((float(data[2 + 2 * i]), data[1 + 2 * i] == b'1') for i in range(n))
P = sum(1 for _, y in pairs if y)
N = n - P
good = 0.0
neg_before = 0
i = 0
while i < n:
    j = i
    pos = neg = 0
    while j < n and pairs[j][0] == pairs[i][0]:
        if pairs[j][1]:
            pos += 1
        else:
            neg += 1
        j += 1
    good += pos * neg_before + pos * neg / 2
    neg_before += neg
    i = j
print(f"{good / (P * N):.9f}")
