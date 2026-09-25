s = input().strip()
n = len(s)
nxt = [0] * n
for i in range(n - 1, -1, -1):
    cur = [0] * n
    cur[i] = 1
    si = s[i]
    for j in range(i + 1, n):
        if si == s[j]:
            cur[j] = nxt[j - 1] + 2
        else:
            cur[j] = nxt[j] if nxt[j] > cur[j - 1] else cur[j - 1]
    nxt = cur
print(nxt[n - 1])
