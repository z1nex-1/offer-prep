s = input().strip()
k = len(set(s))
cnt = [0] * 26
inside = 0
best = len(s)
l = 0
for r, ch in enumerate(s):
    c = ord(ch) - 97
    cnt[c] += 1
    if cnt[c] == 1:
        inside += 1
    while inside == k:
        best = min(best, r - l + 1)
        d = ord(s[l]) - 97
        cnt[d] -= 1
        if cnt[d] == 0:
            inside -= 1
        l += 1
print(best)
