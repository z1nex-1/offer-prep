n = int(input())
MOD = 10 ** 9 + 7
a0, a1, a2 = 1, 0, 0
for _ in range(n):
    a0, a1, a2 = (a0 + a1 + a2) % MOD, a0, a1
print((a0 + a1 + a2) % MOD)
