s = input().strip()
parts = []
i = 0
n = len(s)
while i < n:
    j = i
    while j < n and s[j] == s[i]:
        j += 1
    parts.append(s[i])
    if j - i > 1:
        parts.append(str(j - i))
    i = j
print(''.join(parts))
