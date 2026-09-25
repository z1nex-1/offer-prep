s = input().strip()
n = len(s)
best_l, best_len = 0, 1
for c in range(n):
    for l, r in ((c, c), (c, c + 1)):
        while l >= 0 and r < n and s[l] == s[r]:
            l -= 1
            r += 1
        if r - l - 1 > best_len:
            best_len = r - l - 1
            best_l = l + 1
print(best_len)
print(s[best_l:best_l + best_len])
