import sys

data = sys.stdin.read().split()
n, k, T = int(data[0]), int(data[1]), int(data[2])
vals = list(map(int, data[3:]))
pts = [(vals[2 * i], vals[2 * i + 1]) for i in range(n)]
centers = [(float(vals[2 * (n + j)]), float(vals[2 * (n + j) + 1])) for j in range(k)]


def nearest(p):
    return min(range(k), key=lambda j: (p[0] - centers[j][0]) ** 2 + (p[1] - centers[j][1]) ** 2)


for _ in range(T):
    sx, sy, cnt = [0] * k, [0] * k, [0] * k
    for p in pts:
        j = nearest(p)
        sx[j] += p[0]
        sy[j] += p[1]
        cnt[j] += 1
    centers = [(sx[j] / cnt[j], sy[j] / cnt[j]) if cnt[j] else centers[j] for j in range(k)]

inertia = 0.0
for p in pts:
    j = nearest(p)
    inertia += (p[0] - centers[j][0]) ** 2 + (p[1] - centers[j][1]) ** 2
print('\n'.join(f"{x:.9f} {y:.9f}" for x, y in centers))
print(f"{inertia:.6f}")
