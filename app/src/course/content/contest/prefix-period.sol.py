s = input().strip()
n = len(s)
pi = [0] * n
for i in range(1, n):
    k = pi[i - 1]
    while k and s[i] != s[k]:
        k = pi[k - 1]
    if s[i] == s[k]:
        k += 1
    pi[i] = k
print(n - pi[n - 1])
