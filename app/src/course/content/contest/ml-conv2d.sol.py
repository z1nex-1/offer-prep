import sys

d = list(map(int, sys.stdin.read().split()))
H, W, k, s, p = d[:5]
img = [d[5 + i * W:5 + (i + 1) * W] for i in range(H)]
ker = [d[5 + H * W + i * k:5 + H * W + (i + 1) * k] for i in range(k)]
PH, PW = H + 2 * p, W + 2 * p
P = [[0] * PW for _ in range(PH)]
for i in range(H):
    P[i + p][p:p + W] = img[i]
ho, wo = (PH - k) // s + 1, (PW - k) // s + 1
out = [f"{ho} {wo}"]
for i in range(0, ho * s, s):
    row = []
    for j in range(0, wo * s, s):
        row.append(sum(P[i + a][j + b] * ker[a][b] for a in range(k) for b in range(k)))
    out.append(' '.join(map(str, row)))
print('\n'.join(out))
