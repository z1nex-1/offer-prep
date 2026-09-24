n, t = map(int, input().split())
cnt = [0] * (n + 1)
for d in range(1, n + 1):
    for j in range(d, n + 1, d):
        cnt[j] += 1
print(cnt[1:].count(t))
